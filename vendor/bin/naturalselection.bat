@ECHO OFF
setlocal DISABLEDELAYEDEXPANSION
SET BIN_TARGET=%~dp0/../afterlogic/sabre-dav/bin/naturalselection
python "%BIN_TARGET%" %*
