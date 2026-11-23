# Instalação do ambiente de desenvolvimento (back-end)

Este guia mostra como rodar a API (FastAPI) e o banco (PostgreSQL) na sua máquina Windows. Os comandos são para o **PowerShell**.

## Pré-requisitos

- **Git**
- **Python 3.12** (`winget install Python.Python.3.12`)
- **Docker Desktop**, com o motor rodando (WSL 2 ativado)

Confirme as instalações:

```powershell
git --version
py -3.12 --version
docker --version
```

## 1. Clonar o repositório

```powershell
git clone https://github.com/RafaelCostaSolutions/GC-INTELIGENCE.git
cd GC-INTELIGENCE
git checkout feature/gc-01-backend-cicd
```

O último comando só é necessário enquanto a branch não for mesclada na `main`.

## 2. Configurar as variáveis de ambiente

```powershell
cd backend
Copy-Item .env.example .env
```

O `.env` guarda as configurações locais, incluindo a senha do banco. Ele é ignorado pelo Git e **nunca deve ser enviado ao GitHub**.

## 3. Subir o banco de dados

Com o Docker Desktop aberto, ainda na pasta `backend`:

```powershell
docker compose up -d
docker compose ps
```

O serviço `gc_intelligence_db` deve aparecer como `running (healthy)`.

## 4. Preparar o ambiente Python

```powershell
py -3.12 -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Depois da ativação, o prompt começa com `(.venv)`.

## 5. Rodar a API

```powershell
python -m uvicorn app.main:app --reload
```

Com o servidor rodando, acesse:
- http://127.0.0.1:8000/health, deve mostrar `{"status":"ok"}`
- http://127.0.0.1:8000/docs, documentação interativa

Para parar, pressione `Ctrl + C`.

## 6. Rodar os testes

```powershell
python -m pytest -v
```

## Problemas comuns

- **`docker` não é reconhecido:** abra o Docker Desktop, espere o motor iniciar e feche e abra o terminal.
- **`no configuration file provided`:** você está fora da pasta `backend`. Rode `cd backend`.
- **`Activate.ps1` bloqueado:** rode uma vez `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.
- **Porta 5432 ou 8000 ocupada:** outro programa está usando a porta. Feche-o antes de subir o serviço.
- **`mkdir -p`, `touch` ou `grep` não reconhecidos:** são comandos do Linux. No PowerShell use os equivalentes, ou use o Git Bash.