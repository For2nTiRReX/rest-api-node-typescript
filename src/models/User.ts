import { Post } from "./Post";
export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    address?: Object;
    phone?: string;
    website?: string;
    company?: Object;
    posts?: Post[];
}
  