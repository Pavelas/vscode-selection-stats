import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    150
  );

  statusBarItem.tooltip = "Go to Line/Column";
  statusBarItem.command = "workbench.action.gotoLine";

  const updateStatusBarPosition = () => {
    try {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        statusBarItem.hide();
        return;
      }

      const position = editor.selection.active;
      const selection = editor.selection;
      let displayText = `${position.line + 1}:${position.character + 1}`;

      if (!selection.isEmpty) {
        const selectedText = editor.document.getText(selection);
        const lineCount = selection.end.line - selection.start.line + 1;
        const selectionInfo =
          lineCount > 1
            ? ` (${selectedText.length} chars, ${lineCount} lines)`
            : ` (${selectedText.length} chars)`;
        displayText += selectionInfo;
      }

      statusBarItem.text = displayText;
      statusBarItem.show();
    } catch (error) {
      console.error("Error updating status bar:", error);
      statusBarItem.hide();
    }
  };

  updateStatusBarPosition();

  context.subscriptions.push(
    statusBarItem,
    vscode.window.onDidChangeActiveTextEditor(updateStatusBarPosition),
    vscode.window.onDidChangeTextEditorSelection(updateStatusBarPosition)
  );
}

export function deactivate() {}
