import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    150
  );

  statusBarItem.tooltip = "Go to Line/Column";
  statusBarItem.command = "workbench.action.gotoLine";

  const getSingleCursorDisplayText = (position: vscode.Position) => {
    return `${position.line + 1}:${position.character + 1}`;
  };

  const getSingleSelectionDisplayText = (
    selection: vscode.Selection,
    document: vscode.TextDocument
  ) => {
    const position = selection.active;
    const selectedText = document.getText(selection);
    const lineCount = selection.end.line - selection.start.line + 1;
    const selectionInfo =
      lineCount > 1
        ? ` (${selectedText.length} chars, ${lineCount} lines)`
        : ` (${selectedText.length} chars)`;
    return `${position.line + 1}:${position.character + 1}${selectionInfo}`;
  };

  const getMultiSelectionDisplayText = (
    selections: readonly vscode.Selection[],
    document: vscode.TextDocument
  ) => {
    let totalChars = 0;
    let totalLines = 0;
    for (const sel of selections) {
      totalChars += document.getText(sel).length;
      totalLines += sel.end.line - sel.start.line + 1;
    }
    return `${selections.length} selected (${totalChars} chars, ${totalLines} lines)`;
  };

  const updateStatusBarPosition = () => {
    try {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        statusBarItem.hide();
        return;
      }

      const position = editor.selection.active;
      const selection = editor.selection;
      const selections = editor.selections;
      let displayText: string;

      if (selections.length > 1) {
        displayText = getMultiSelectionDisplayText(selections, editor.document);
      } else if (!selection.isEmpty) {
        displayText = getSingleSelectionDisplayText(selection, editor.document);
      } else {
        displayText = getSingleCursorDisplayText(position);
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
