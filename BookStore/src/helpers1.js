export const getSubstring1 = (text: string, substringEnd: number): string => {
    return text.length > substringEnd ? text.substring(0, substringEnd) + '...' : text
}