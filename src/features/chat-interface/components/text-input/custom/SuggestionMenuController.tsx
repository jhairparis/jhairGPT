"use client";
import {
  BlockSchema,
  InlineContentSchema,
  StyleSchema,
  SuggestionMenuState,
  filterSuggestionItems,
} from "@blocknote/core";
import {
  DefaultReactSuggestionItem,
  SuggestionMenuProps,
  SuggestionMenuWrapper,
  getDefaultReactSlashMenuItems,
  useBlockNoteEditor,
  useComponentsContext,
  useDictionary,
} from "@blocknote/react";
import { flip, offset, shift, size } from "@floating-ui/react";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  useDismiss,
  useFloating,
  UseFloatingOptions,
  useInteractions,
  useTransitionStyles,
} from "@floating-ui/react";

type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

type ItemType<GetItemsType extends (query: string) => Promise<any[]>> =
  ArrayElement<Awaited<ReturnType<GetItemsType>>>;

function useUIPluginState<State>(
  onUpdate: (callback: (state: State) => void) => void
): State | undefined {
  const [state, setState] = useState<State>();

  useEffect(() => {
    return onUpdate((state) => {
      setState({ ...state });
    });
  }, [onUpdate]);

  return state;
}
function useUIElementPositioning(
  show: boolean,
  referencePos: DOMRect | null,
  zIndex: number,
  options?: Partial<UseFloatingOptions>
) {
  const { refs, update, context, floatingStyles } = useFloating({
    open: show,
    ...options,
  });

  const { isMounted, styles } = useTransitionStyles(context);

  // handle "escape" and other dismiss events, these will add some listeners to
  // getFloatingProps which need to be attached to the floating element
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss]);

  useEffect(() => {
    update();
  }, [referencePos, update]);

  useEffect(() => {
    // Will be null on initial render when used in UI component controllers.
    if (referencePos === null) {
      return;
    }

    refs.setReference({
      getBoundingClientRect: () => referencePos,
    });
  }, [referencePos, refs]);

  return useMemo(
    () => ({
      isMounted,
      ref: refs.setFloating,
      style: {
        display: "flex",
        ...styles,
        ...floatingStyles,
        zIndex: zIndex,
      },
      getFloatingProps,
      getReferenceProps,
    }),
    [
      floatingStyles,
      isMounted,
      refs.setFloating,
      styles,
      zIndex,
      getFloatingProps,
      getReferenceProps,
    ]
  );
}

function SuggestionMenu<T extends DefaultReactSuggestionItem>(
  props: SuggestionMenuProps<T>
) {
  const Components = useComponentsContext()!;
  const dict = useDictionary();

  const { items, loadingState, selectedIndex, onItemClick } = props;

  const loader =
    loadingState === "loading-initial" || loadingState === "loading" ? (
      <Components.SuggestionMenu.Loader className={"bn-suggestion-menu-loader"}>
        {dict.suggestion_menu.loading}
      </Components.SuggestionMenu.Loader>
    ) : null;

  const renderedItems = useMemo<JSX.Element[]>(() => {
    let currentGroup: string | undefined = undefined;
    const renderedItems = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.group !== currentGroup) {
        currentGroup = item.group;
        renderedItems.push(
          <Components.SuggestionMenu.Label
            className={"bn-suggestion-menu-label"}
            key={currentGroup}
          >
            {currentGroup}
          </Components.SuggestionMenu.Label>
        );
      }

      renderedItems.push(
        <Components.SuggestionMenu.Item
          className={"bn-suggestion-menu-item"}
          item={item}
          id={`bn-suggestion-menu-item-${i}`}
          isSelected={i === selectedIndex}
          key={item.title}
          onClick={() => onItemClick?.(item)}
        />
      );
    }

    return renderedItems;
  }, [Components, items, onItemClick, selectedIndex]);

  return (
    <Components.SuggestionMenu.Root
      id="bn-suggestion-menu"
      className="bn-suggestion-menu"
    >
      {renderedItems}
      {renderedItems.length === 0 &&
        (props.loadingState === "loading" ||
          props.loadingState === "loaded") && (
          <Components.SuggestionMenu.EmptyItem
            className={"bn-suggestion-menu-item"}
          >
            {dict.suggestion_menu.no_items_title}
          </Components.SuggestionMenu.EmptyItem>
        )}
      {loader}
    </Components.SuggestionMenu.Root>
  );
}

export function SuggestionMenuControllerCustom<
  GetItemsType extends (query: string) => Promise<any[]> = (
    query: string
  ) => Promise<DefaultReactSuggestionItem[]>
>(
  props: {
    triggerCharacter: string;
    getItems?: GetItemsType;
    minQueryLength?: number;
    show: boolean;
    onUpdate: (state: SuggestionMenuState) => void;
  } & (ItemType<GetItemsType> extends DefaultReactSuggestionItem
    ? {
        suggestionMenuComponent?: FC<
          SuggestionMenuProps<ItemType<GetItemsType>>
        >;
        onItemClick?: (item: ItemType<GetItemsType>) => void;
      }
    : {
        suggestionMenuComponent: FC<
          SuggestionMenuProps<ItemType<GetItemsType>>
        >;
        onItemClick: (item: ItemType<GetItemsType>) => void;
      })
) {
  const editor = useBlockNoteEditor<
    BlockSchema,
    InlineContentSchema,
    StyleSchema
  >();

  const {
    triggerCharacter,
    suggestionMenuComponent,
    minQueryLength,
    onItemClick,
    getItems,
    show,
    onUpdate,
  } = props;

  const onItemClickOrDefault = useMemo(() => {
    return (
      onItemClick ||
      ((item: ItemType<GetItemsType>) => {
        item.onItemClick(editor);
      })
    );
  }, [editor, onItemClick]);

  const getItemsOrDefault = useMemo(() => {
    const noImplement = ["Audio", "Video", "Image", "File"];

    return (
      getItems ||
      ((async (query: string) =>
        filterSuggestionItems(
          getDefaultReactSlashMenuItems(editor).filter(
            (e) => !noImplement.includes(e.title)
          ),
          query
        )) as any as typeof getItems)
    );
  }, [editor, getItems])!;

  const callbacks = {
    closeMenu: editor.suggestionMenus.closeMenu,
    clearQuery: editor.suggestionMenus.clearQuery,
  };

  const cb = useCallback(
    (callback: (state: SuggestionMenuState) => void) => {
      return editor.suggestionMenus.onUpdate(triggerCharacter, (state) => {
        callback(state);
        onUpdate(state);
      });
    },
    [editor.suggestionMenus, triggerCharacter, onUpdate]
  );

  const state = useUIPluginState(cb);

  const { isMounted, ref, style, getFloatingProps } = useUIElementPositioning(
    show,
    state?.referencePos || null,
    2000,
    {
      placement: "top-start",
      middleware: [
        offset(10),
        flip({ mainAxis: true, crossAxis: false }),
        shift(),
        size({
          apply({ availableHeight, elements }) {
            Object.assign(elements.floating.style, {
              maxHeight: `${availableHeight - 10}px`,
            });
          },
        }),
      ],
      onOpenChange(open) {
        if (!open) {
          editor.suggestionMenus.closeMenu();
        }
      },
    }
  );

  if (
    !isMounted ||
    !state ||
    (minQueryLength &&
      (state.query.startsWith(" ") || state.query.length < minQueryLength))
  ) {
    return null;
  }

  return (
    <div ref={ref} style={style} {...getFloatingProps()}>
      <SuggestionMenuWrapper
        query={state.query}
        closeMenu={callbacks.closeMenu}
        clearQuery={callbacks.clearQuery}
        getItems={getItemsOrDefault}
        suggestionMenuComponent={suggestionMenuComponent || SuggestionMenu}
        onItemClick={onItemClickOrDefault}
      />
    </div>
  );
}
