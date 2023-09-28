import { AsyncStorage } from 'react-native';
import { types, flow } from 'mobx-state-tree';

import { baseApi } from '../api/API';
import NavigationService from '../api/NavigationService';

import { UserInfo, orders, order } from "./types"
import { NOTIF_TOKEN } from "../constants";


//firebas/firestore
//FireStore
// import * as firebase from 'firebase'
// import 'firebase/firestore';
// import 'firebase/auth';

import "../utils/clearTimer";

const TOKEN_KEY = '@dinnk/token';
const ID_KEY = '@dinnk/id';



export const CurrentUser = types
  .model('CurrentUser', {
    authToken: types.maybe(types.string),
    logedin: false,
    isLoading: true,
    id: types.maybe(types.string),
    error: types.maybe(types.string),
    info: types.maybe(UserInfo),
    userToConsulte: types.maybe(UserInfo),
    orders: types.maybe(orders, undefined),
  })
  .views(self => ({
    get isLogedIn() {
      return self.logedin;
    }
  })).actions(self => ({
    logout: flow(function* () {
      //      yield AsyncStorage.multiSet([[TOKEN_KEY, token], [ID_KEY, `${id}`]])
      try {
        const data_tkn = {
          tokenNotification: "",
        }
        console.log("logout: id=>", self.id);
        let logout = yield baseApi.url(`/api/logout/${self.id}`)
        .headers({
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        })
        .get()
        .json();
        console.log("logout: ", logout)
        yield self.updateNotifToken(data_tkn);
        yield AsyncStorage.multiRemove([TOKEN_KEY, ID_KEY])
        //yield self.pushNotifTokenToFirestore("");
        //        yield firebase.auth().signOut();
        self.authToken = undefined;
        self.logedin = false;
        self.id = undefined;
        self.error = undefined;
        self.info = undefined;
      } catch (error) {
        console.log("error: ", error)
      }
    }),
    setupAuth: flow(function* () {
      try {
        yield self.getAuthToken();
        yield self.getUserInfo();
        self.isLoading = false;
      } catch (error) {
        console.log(error)
      }
    }),
    getAuthToken: flow(function* () {
      try {
        const token = yield AsyncStorage.getItem(TOKEN_KEY);
        const id = yield AsyncStorage.getItem(ID_KEY);

        if (token) {
          self.authToken = token;
          self.id = id
        } else {
          NavigationService.navigate('Auth');
        }
      } catch (error) {
        console.log(error);
      }
    }),
    saveToken: flow(function* (token, id) {
      try {
        yield AsyncStorage.multiSet([[TOKEN_KEY, token], [ID_KEY, `${id}`]])
      } catch (error) {
        console.log('error', error);
      }
    }),
    login: flow(function* (username, password) {
      try {
        console.log("start");
        let status = 200

        const tkn = yield baseApi
          .url("/login_check")
          .headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          })
          .post({
            username: username,
            password: password
          })
          .unauthorized((er) => {
            console.log(er.status);
            console.log(er);
            status = er.status
          })
          .json();
        console.log("end");
        if (status != 200) {
          self.error = `${status}: Invalide informations`;
          return;
        }
        console.log("tkn",tkn);
        if (tkn) {
          const res = yield baseApi
          .url("/api/utilisateurs")
          .query({ login: username })
          .headers({
            'Accept': 'application/json',
            'Content-Type': 'application/ld+json',
            'Cache-Control': 'no-cache'
          })
          .get()
          .json();
          yield self.saveToken(tkn.token, res[0].id);
          self.authToken = tkn.token;
          console.log("id: ", res[0].id);
          self.id = `${res[0].id}`;
          //save notif token in database
          //yield self.pushNotifTokenToFirestore(notifToken);
          //yield firebase.auth().signInAnonymously();

        }
        const notifToken = yield AsyncStorage.getItem(NOTIF_TOKEN);
        console.log("notifToken nn", notifToken);
        const data_tkn = {
          tokenNotification: notifToken,
        }
        yield self.updateNotifToken(data_tkn)
        console.log("data_tkn nn", data_tkn);
        yield self.getUserInfo();
        console.log("self.info: ", self.info);
        console.log("info toke: ", self.info.tokenNotification)
      } catch (error) {
        console.log('test: nor', error);

      }
    }),
    getUserInfo: flow(function* () {
      try {
        if (self.authToken) {
          const res = yield self.getUserById(self.id);
          self.info = res;
          self.logedin = true;
        }
      } catch (error) {
        console.log('error', error);
      }
    }),
    getUserById: flow(function* (id) {
      const res = yield baseApi
        .url(`/api/utilisateurs/${id}`)
        .headers({
          //    Authorization: `Bearer ${self.authToken}`
          "Cache-Control": "no-cache",
          Accept: "application/ld+json"
        })
        .get()
        .json();
      return res;
    }),
    consulteUser: flow(function* (id) {
      try {
        const res = yield self.getUserById(id);
        self.userToConsulte = res;
      } catch (error) {
        console.log(error);
      }
    }),
    updateNotifToken: flow(function* (data) {
      console.log(self.id)
      yield baseApi
        .url(`/api/utilisateurs/${self.id}`)
        .put({ ...data })
        .notFound(() => console.log("not Found"))
        .error(400, () => { error = "invalide input" })
        .json();
    }),
    loadOrders: flow(function* () {
      if (!self.info) { return };
      if (!self.orders) { self.orders = orders.create() };

      try {
        const userID = self.info.id;
        const role = self.info.role
        const data = {
          livreur: role.id === 3 ? userID : undefined,
          client: role.id === 2 ? userID : undefined
        }
        yield self.orders.get(data);  
      } catch (error) {
        console.log("loadOrders: ", error);
      }
    })
    // pushNotifTokenToFirestore: flow(function* (token) {
    //   const dbh = firebase.firestore();
    //   const docName = `api_utilisateurs_${self.id}`;
    //   try {
    //     yield dbh.collection("tokens").doc(docName).set({
    //       token: token,
    //       source: "@dinnkExpo",
    //     });
    //   } catch (error) {
    //     console.log("firestore: ", error)
    //   }
    // })
  }));