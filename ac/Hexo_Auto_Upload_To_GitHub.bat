@echo off
rem 设置命令提示符编码为 UTF-8，避免乱码
chcp 65001 >nul

rem 打开 Git Bash 并定位到桌面的 blog 文件夹，然后执行 hexo 命令
rem 定义桌面 blog 文件夹路径
set BLOG_PATH=%USERPROFILE%\Desktop\blog

rem 检查 blog 文件夹是否存在
if not exist "%BLOG_PATH%" (
    echo 错误: 找不到路径 %BLOG_PATH%
    pause
    exit /b
)

rem 打开 Git Bash 并执行命令
echo 正在打开 Git Bash 并执行 hexo 命令...
start "" "C:\Program Files\Git\git-bash.exe" --cd-to-home -c "cd '%BLOG_PATH%' && hexo clean && hexo generate && hexo deploy; echo 命令已完成，窗口将在 5 秒后关闭...; sleep 5"
