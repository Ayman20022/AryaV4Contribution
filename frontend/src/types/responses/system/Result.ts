export interface Result<T> {
    flag: boolean;
    code: number;
    message: string;
    data: T;
}