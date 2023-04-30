import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../models/user.interface';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { EncryptionService } from '../encryption/encryption.service';
import { LocalStoreService } from '../local-store/local-store.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: Observable<User[]>;
  private usersCollection: AngularFirestoreCollection<User>;
  private userDoc: AngularFirestoreDocument<User>;
  private user: Observable<User>;
  private currentUserSubject: BehaviorSubject<User>;

  constructor(
    private afs: AngularFirestore,
    private encryptionService: EncryptionService,
    private ls: LocalStoreService
  ) {
    this.usersCollection = afs.collection<User>('users');
    this.users = this.usersCollection.valueChanges();
  }

  getAllUsers(): Observable<User[]> {
    return this.users = this.afs.collection<User>('users')
      .snapshotChanges()
      .pipe(map(changes => {
        return changes.map(action => {
          const data = action.payload.doc.data() as User;
          data.uid = action.payload.doc.id;
          return data;
        });
      }));
  }

  createUser(user: User) {
    return new Promise(async (resolve, reject) => {
      try {
        const docRef = this.afs.collection<User>('users').doc(user.uid);
        const docSnapshot = await docRef.get().toPromise();

        if (docSnapshot.exists) {
          reject("El usuario ya está registrado");
        } else {
          const result = await docRef.set(user);
          resolve(result);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  getUserByUid(uid: string) {
    this.userDoc = this.afs.doc<User>(`users/${uid}`);
    return this.user = this.userDoc.snapshotChanges().pipe(map(action => {
      if (action.payload.exists === false) {
        return null;
      } else {
        const data = action.payload.data() as User;
        return data;
      }
    }));
  }


}
