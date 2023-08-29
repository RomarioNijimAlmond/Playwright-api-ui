export interface IPet {
    name: string,
    photoUrls: string[],
    id?: number,
    category?: {},
    tags?: {},
    status?: string,
}

export interface ICategory {
    id?: number,
    name?: string,
}

export interface ITag {
    id?: number,
    name?: string,
}

export interface IOrder {
    id?: number,
    petId?: number,
    quantity?: number,
    shipDate?: string,
    status?: string,
    complete?: boolean,
}

export interface IUser {
    id?: number,
    username?: string,
    firstName?: string,
    lastName?: string,
    email?: string,
    password?: string,
    phone?: string,
    userStatus?: number,
}

export interface inventory {
    available?: string,
    Pending?: string,
    Active?: string,
}