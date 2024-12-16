
import { IBreadcrumbItem, ICategory, IItem, NavCategory, NavItem } from "./model";


export const navItems: NavItem[] = [
    {
        label: "All Products",
        href: '/products',
    },
]
export const defaultBreadcrumbItems: IBreadcrumbItem[] = [
    {
        name: 'Products',
        link: '/products'
    },
    {
        name: 'Categories',
        link: '/categories'
    }
]
export const getSubstring = (text: string, substringEnd: number): string => {
    return text?.length > substringEnd ? text.substring(0, substringEnd) + '...' : text;
}

export const calculateItemsTotal = (items: IItem[]): number => {
    return items
        .map((item) => ({ price: item.promotional_price, count: item.count }))
        .reduce(
            (previousValue, currentValue) =>
                previousValue + currentValue.price * currentValue.count,
            0
        );
};

