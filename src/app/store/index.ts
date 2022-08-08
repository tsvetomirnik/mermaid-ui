import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';

import * as diagramStore from './../diagram-editor/store/diagram-editor.reducer';
import { diagramEditorFeatureKey } from './../diagram-editor/store/diagram-editor.reducer';

export interface State {
  [diagramEditorFeatureKey]: diagramStore.State;
}

export const reducers: ActionReducerMap<State> = {
  [diagramEditorFeatureKey]: diagramStore.reducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
