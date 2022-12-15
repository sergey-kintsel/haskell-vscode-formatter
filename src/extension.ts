import * as proc from 'child_process';
import * as pathModule from 'path';
import * as vscode from 'vscode';

const haskellLangId = 'haskell';
export function activate(context: vscode.ExtensionContext) {
  vscode.languages.registerDocumentRangeFormattingEditProvider(haskellLangId, {
    provideDocumentRangeFormattingEdits(document, range, options, token) {
      const showErrorMessage = (friendlyText, error) => {
        vscode.window.showErrorMessage(`${friendlyText}\n${error.stderr.toString()}`);
        return [];
      }

      try {
        proc.execSync('hindent --help');
      } catch (e) {
        return showErrorMessage("HIndent is not installed", e);
      }
      try {
        proc.execSync('stylish-haskell --help');
      } catch (e) {
        return showErrorMessage("stylish-haskell is not installed", e);
      }

      const text = document.getText(range);
      const editor = vscode.window.activeTextEditor;
      const dir = editor == null ? undefined : pathModule.dirname(editor.document.uri.fsPath);
      let hindentedText;
      try {
        hindentedText = proc.execSync('hindent', { input: text, cwd: dir }).toString();
      } catch (e) {
        return showErrorMessage('hindent failed to format the code', e);
      }
      let styledText;
      try {
        styledText = proc.execSync('stylish-haskell', { input: hindentedText, cwd: dir }).toString();
      } catch (e) {
        return showErrorMessage('stylish-haskell failed to format the code', e);
      }
      return [vscode.TextEdit.replace(range, styledText)]
    }
  })
}
