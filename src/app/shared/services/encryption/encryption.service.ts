import { Injectable } from '@angular/core';
import { credentials } from 'credentials';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  private readonly key: string = credentials.secretKey;

  constructor() { }

  encrypt(data: any): string {
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), this.key).toString();
    return ciphertext;
  }

  decrypt(ciphertext: string): any {
    const bytes = CryptoJS.AES.decrypt(ciphertext, this.key);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  }

}
