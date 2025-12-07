@echo off
REM Inicia un servidor HTTP en el puerto 8888 usando Python y abre el navegador
cd /d %~dp0
start "" http://localhost:8888
python -m http.server 8888
