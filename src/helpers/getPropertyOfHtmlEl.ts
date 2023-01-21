export function getPropertiesOfHTMLel(element: any): { [key: string]: number } {
    const elementProp = element.getBoundingClientRect();

    return { height: elementProp.height, width: elementProp.width };
}
