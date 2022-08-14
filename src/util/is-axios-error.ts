import {
  AxiosError,
} from 'axios';

const isAxiosError = (error: any): error is AxiosError => error && error.isAxiosError;
export default isAxiosError;
