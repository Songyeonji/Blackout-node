import { EditorState, Modifier, AtomicBlockUtils } from 'draft-js';

// 기본 내보내기로 변경
export default function InsertImage(editorState, imageUrl) {
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity('IMAGE', 'IMMUTABLE', { src: imageUrl });
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const newEditorState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');

  return EditorState.forceSelection(
    newEditorState,
    newEditorState.getCurrentContent().getSelectionAfter()
  );
}
