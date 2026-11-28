from fastapi.testclient import TestClient

from src.server import app


def test_tables_and_hospital_isolation(client):
    a = client.post('/hospitals', json={'name': 'Hospital A'}).json()['id']
    b = client.post('/hospitals', json={'name': 'Hospital B'}).json()['id']
    HA, HB = {'X-Hospital-Id': str(a)}, {'X-Hospital-Id': str(b)}

    # patient in hospital A (trying to cheat by sending hospital B's id in the body)
    r = client.post('/patients', headers=HA, json={'name': 'Maria', 'cpf': '111', 'birth_date': '1990-05-01', 'hospital_id': b})
    assert r.status_code == 201, r.text
    p = r.json()
    assert p['hospital_id'] == a

    # B cannot see, update or delete A's patient
    assert client.get('/patients', headers=HB).json() == []
    assert client.get(f"/patients/{p['id']}", headers=HB).status_code == 404
    assert client.put(f"/patients/{p['id']}", headers=HB, json={'name': 'Hack'}).status_code == 404
    assert client.delete(f"/patients/{p['id']}", headers=HB).status_code == 404

    # A can see, update and deactivate it
    assert len(client.get('/patients', headers=HA).json()) == 1
    r = client.put(f"/patients/{p['id']}", headers=HA, json={'name': 'Maria Silva', 'cpf': '111'})
    assert r.json()['name'] == 'Maria Silva'
    assert client.delete(f"/patients/{p['id']}", headers=HA).json() == {'message': 'Paciente desativado'}
    assert client.get('/patients', headers=HA).json() == []

    # professionals follow the same rule
    r = client.post('/professionals', headers=HA, json={'name': 'Dr. João', 'kind': 'medico', 'council': 'CRM', 'registry_number': '12345', 'registry_state': 'DF'})
    assert r.status_code == 201, r.text
    assert client.get('/professionals', headers=HB).json() == []
    assert len(client.get('/professionals', headers=HA).json()) == 1


def test_hospital_must_exist(client):
    # GC-5: an unknown hospital is rejected
    r = client.get('/patients', headers={'X-Hospital-Id': '999'})
    assert r.status_code == 404
    assert r.json() == {'code': 'NOT_FOUND', 'message': 'Hospital não encontrado'}


def test_errors_use_standard_format(client):
    # GC-6: every error is {code, message}
    h = client.post('/hospitals', json={'name': 'Hospital C'}).json()['id']
    H = {'X-Hospital-Id': str(h)}

    r = client.get('/patients')  # missing header
    assert r.status_code == 422 and set(r.json()) == {'code', 'message'} and r.json()['code'] == 'VALIDATION_ERROR'

    r = client.post('/patients', headers=H, json={})  # missing name
    assert r.status_code == 422 and r.json()['code'] == 'VALIDATION_ERROR' and 'name' in r.json()['message']

    r = client.get('/patients/12345', headers=H)
    assert r.status_code == 404 and r.json() == {'code': 'NOT_FOUND', 'message': 'Paciente não encontrado'}

    client.post('/patients', headers=H, json={'name': 'Ana', 'cpf': '222'})
    r = client.post('/patients', headers=H, json={'name': 'Ana again', 'cpf': '222'})  # duplicated CPF
    assert r.status_code == 409 and r.json() == {'code': 'CONFLICT', 'message': 'Já existe um registro com esses dados'}

    r = client.get('/route-that-does-not-exist')
    assert r.status_code == 404 and r.json() == {'code': 'NOT_FOUND', 'message': 'Rota não encontrada'}


def test_unexpected_error_hides_details():
    @app.get('/_test_crash')
    def crash():
        raise RuntimeError('internal secret')

    r = TestClient(app, raise_server_exceptions=False).get('/_test_crash')
    assert r.status_code == 500
    assert r.json() == {'code': 'INTERNAL_ERROR', 'message': 'Erro interno. Tente novamente mais tarde.'}
