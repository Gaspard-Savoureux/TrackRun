export interface registerFields {
    username?: string;
    email?: string ;
    password?: string;
    lastname?: string;
    firstname?: string;
    birthdate?: string;
  }
  
export interface formDataRegister extends FormData, registerFields {
    success: boolean;
    message: string;
  }
