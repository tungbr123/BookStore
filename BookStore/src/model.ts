export type ItemKey='cart' | 'wishlist' | 'checkout'

export interface NavItem{
    label: string,
    href: string
}

export interface IRating{
    rate: number;
}

export interface IProduct{
    id: number;
    name: string;
    description: string;
    price: number;
    promotional_price: number;
    quantity: number;
    image: string;
    category: ICategory
    rating: number;
}

export interface ICategory{
    id: string;
    name: string;
    image: string;
}
export interface IFeaturedItems{
    topCategories: ICategory[];
    bestDeals: IProduct[];
    mostSellingProducts: IProduct[];
    trendingProducts: IProduct[];
    relatedProducts: IProduct[];
}
export interface IBreadcrumbItem{
    name: string;
    link: string;
}

export interface IState{
    cart: IItem[];
    wishlist: IItem[];
    checkout: IItem[];
}

export interface IItem extends IProduct{
    count: number
}

export interface IContext{
    state: IState;
    addItem: (key: ItemKey, product: IProduct, count?: number) => void;
    removeItem: (key: ItemKey, productId: number) => void;
    increaseCount: (key: ItemKey, productId: number) => void;
    decreaseCount: (key: ItemKey, productId: number) => void;
    resetItems: (key: ItemKey) => void;
    isAdded: (key: ItemKey, productId: number) => boolean;
}

// model.ts
export interface IReview {
    name: string;
    stars: number;
    content: string;
    avatar: string;
}
