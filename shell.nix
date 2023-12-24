{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/d6863cbcbbb80e71cecfc03356db1cda38919523.tar.gz") {} }:
pkgs.mkShell {
    name = "JavascriptPluginBoilerplateShell";
    buildInputs = with pkgs; [
      git
      nodejs
      nodejs.pkgs.pnpm
      nodePackages.typescript-language-server
    ];
}
