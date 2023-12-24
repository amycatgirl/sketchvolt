{ pkgs ? import <nixpkgs> {} }:
pkgs.mkShell {
    name = "JavascriptPluginBoilerplateShell";
    buildInputs = with pkgs; [
      git
      nodejs
      nodejs.pkgs.pnpm
      nodePackages.typescript-language-server
    ];
}
