@ECHO OFF
setlocal DISABLEDELAYEDEXPANSION
SET BIN_TARGET=%~dp0/../afterlogic/sabre-dav/bin/sabredav
sh "%BIN_TARGET%" %*
