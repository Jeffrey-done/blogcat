@echo off
rem 设置命令提示符编码为 UTF-8，避免乱码
chcp 65001 >nul

rem 检查管理员权限
net session >nul 2>nul
if %errorlevel% neq 0 (
    echo 本脚本需要管理员权限才能运行。请右键点击该文件并选择“以管理员身份运行”。
    pause
    exit /b
)

rem 定义脚本文件路径
set SCRIPT_PATH=%~dp0Hexo_Auto_Upload_To_GitHub.bat

rem 检查目标脚本是否存在
if not exist "%SCRIPT_PATH%" (
    echo 错误: 找不到目标脚本 %SCRIPT_PATH%。请确保该文件与此脚本在同一文件夹内。
    pause
    exit /b
)

rem 定义任务名称
set TASK_NAME=HexoAutoUpload

rem 创建任务计划
echo 正在创建定时任务...
schtasks /create /tn "%TASK_NAME%" /tr "%SCRIPT_PATH%" /sc once /st 00:00 /f >nul
schtasks /change /tn "%TASK_NAME%" /sc daily /mo 1 /st 00:00 >nul
schtasks /change /tn "%TASK_NAME%" /ri 120 /du 9999:59 /enable >nul

if %errorlevel%==0 (
    echo 定时任务 "%TASK_NAME%" 创建成功！
    echo 脚本将每隔 2 小时运行一次。
) else (
    echo 定时任务创建失败，请检查任务计划程序设置。
)

rem 完成
pause
exit
