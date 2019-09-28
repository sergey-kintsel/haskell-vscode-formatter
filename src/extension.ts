import * as vscode from 'vscode';
import * as proc from 'child_process';

const haskellLangId = 'haskell';
export function activate(context: vscode.ExtensionContext) {
  vscode.languages.registerDocumentRangeFormattingEditProvider(haskellLangId, {
    provideDocumentRangeFormattingEdits(document, range, options, token) {
      const cwd = vscode.workspace.rootPath;
      const showErrorMessage = (friendlyText, error) => {
        vscode.window.showErrorMessage(`${friendlyText}\n${error.stderr.toString()}`);
        return [];
      }

      try {
        proc.execSync('hindent --help', {cwd: cwd});
      } catch (e) {
        return showErrorMessage("HIndent is not installed", e);
      }
      try {
        proc.execSync('stylish-haskell --help', {cwd: cwd});
      } catch (e) {
        return showErrorMessage("stylish-haskell is not installed", e);
      }

      const text = document.getText(range);
      let hindentedText;
      try {
        hindentedText = proc.execSync('hindent', {input: text, cwd: cwd}).toString();
      } catch (e) {
        return showErrorMessage('hindent failed to format the code', e);
      }
      let styledText;
      try {
        styledText = proc.execSync('stylish-haskell', {input: hindentedText, cwd: cwd}).toString();
      } catch (e) {
        return showErrorMessage('stylish-haskell failed to format the code', e);
      }
      return [vscode.TextEdit.replace(range, styledText)]
    }
  })
}
