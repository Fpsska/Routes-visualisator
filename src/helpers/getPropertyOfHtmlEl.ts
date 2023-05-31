type TypeRectResult = {
    bottom: number;
    height: number;
    left: number;
    right: number;
    top: number;
    width: number;
};

// /. types

export function getPropertiesOfHTMLel(
    element: HTMLElement
): TypeRectResult | null {
    if (!element) return null;

    return element.getBoundingClientRect();
}
