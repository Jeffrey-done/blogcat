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

rem 定义任务名称
set TASK_NAME=HexoAutoUpload

rem 删除任务计划
echo 正在删除定时任务 "%TASK_NAME%"...
schtasks /delete /tn "%TASK_NAME%" /f >nul

if %errorlevel%==0 (
    echo 定时任务 "%TASK_NAME%" 已成功删除！
) else (
    echo 定时任务删除失败，请检查任务计划程序设置。
)

rem 完成
pause
exit
