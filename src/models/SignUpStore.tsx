import { computed, makeAutoObservable, observable, } from "mobx";
import {
  names,
  email,
  required,
  password,
  confirmPassword,
  phoneNumber,
  alphaNumeric,
  number
} from "../utils/validators";
import { baseApi } from "../api/API";
import { strings as lang } from "../lang";

interface imageName {
  base64: string,
  type: string,
  uri: string,
  name: string
}
export default class SignUpStore {


  constructor() {
    makeAutoObservable(this);
  }
  //@observable
  private _loading: boolean = false;
  @computed get loading(): boolean { return this._loading; }
  set loading(loading: boolean) { this._loading = loading; }

  //@observable
  private _image: imageName = undefined;
  @computed get image(): imageName { return this._image; }
  set image(image: imageName) { this._image = image; }

  //@observable
  private _role: string = undefined;
  @computed get role(): string { return this._role; }
  set role(role: string) { this._role = role; }

  //@observable
  private _sexe: string = "";
  @computed get sexe(): string { return this._sexe; }
  set sexe(sexe: string) { this._sexe = sexe; }

  //@observable
  private _contry: string = "";
  @computed get contry(): string { return this._contry; }
  set contry(contry: string) { this._contry = contry; }

  //@observable
  private _carrierType: string = undefined;
  @computed get carrierType(): string { return this._carrierType; }
  set carrierType(carrierType: string) { this._carrierType = carrierType; }


  //@observable
  private _name: string = "";
  @computed get name(): string { return this._name; }
  set name(name: string) { this._name = name; }

  //@observable
  private _fname: string = "";
  @computed get fname(): string { return this._fname; }
  set fname(fname: string) { this._fname = fname; }

  //@observable
  private _email: string = "";
  @computed get email(): string { return this._email; }
  set email(email: string) { this._email = email; }

  //@observable
  private _password: string = "";
  @computed get password(): string { return this._password; }
  set password(password: string) { this._password = password; }

  //@observable
  private _corporate: string = undefined;
  @computed get corporate(): string { return this._corporate; }
  set corporate(corporate: string) { this._corporate = corporate; }

  //@observable
  private _siren: string = undefined;
  @computed get siren(): string { return this._siren; }
  set siren(siren: string) { this._siren = siren; }

  //@observable
  private _siret: string = undefined;
  @computed get siret(): string { return this._siret; }
  set siret(siret: string) { this._siret = siret; }

  //@observable
  private _cpass: string = "";
  @computed get cpass(): string { return this._cpass; }
  set cpass(cpass: string) { this._cpass = cpass; }

  //@observable
  private _tel: string = "";
  @computed get tel(): string { return this._tel; }
  set tel(tel: string) { this._tel = tel; }

  private data = {
    nom: undefined,
    prenom: undefined,
    raisonSociale: undefined,
    siret: undefined,
    siren: undefined,
    numeroTel: undefined,
    login: undefined,
    plainPassword: undefined,
    sexe: undefined,
    pays: undefined,
    typeCoursier: undefined,
    role: undefined,
  }
  private map(): void {
    this.data.nom = this.fname;
    this.data.prenom = this.name;
    this.data.raisonSociale = this.corporate;
    this.data.siret = this.siret;
    this.data.siren = this.siren;
    this.data.numeroTel = this.tel;
    this.data.login = this.email;
    this.data.plainPassword = this.password;
    this.data.sexe = this.sexe;
    this.data.pays = this.contry;
    this.data.typeCoursier = this.carrierType;
    this.data.role = this.role;
  }

  public reset() {
    this.fname = undefined;
    this.name = undefined;
    this.corporate = undefined;
    this.siret = undefined;
    this.siren = undefined;
    this.tel = undefined;
    this.email = undefined;
    this.password = undefined;
    this.cpass = undefined;
    this.sexe = undefined;
    this.contry = undefined;
    this.carrierType = undefined;
    this.role = undefined;
  }

  private validate = (): boolean => {
    const errors = {
      name: undefined,
      fname: undefined,
      email: undefined,
      tel: undefined,
      password: undefined,
      cpass: undefined,
      sexe: undefined,
      contry: undefined,
      role: undefined,
      corporate: undefined,
      siret: undefined,
      siren: undefined,
      carrierType: undefined,
    }
    errors.name = required(this.name);
    errors.name = errors.name ? errors.name : names(this.name);

    errors.fname = required(this.fname);
    errors.fname = errors.fname ? errors.fname : names(this.fname);

    errors.email = required(this.email);
    errors.email = errors.email ? errors.email : email(this.email);

    errors.tel = required(this.tel);
    errors.tel = errors.tel ? errors.tel : phoneNumber(this.tel);

    errors.password = required(this.password);
    errors.password = errors.password ? errors.password : password(this.password);
    errors.cpass = errors.password ? undefined : confirmPassword(this.cpass, this.password);

    errors.sexe = required(this.sexe);
    errors.contry = required(this.contry);
    errors.role = required(this.role);
    if (!errors.role) {
      if (this.role === "/api/roles/2") {
        errors.corporate = required(this.corporate);
        errors.corporate = errors.corporate ? errors.corporate : alphaNumeric(this.corporate);
      } else if (this.role === "/api/roles/3") {
        errors.siret = required(this.siret);
        errors.siret = errors.siret ? errors.siret : number(this.siret.split(" ").join(""));

        errors.siren = required(this.siren);
        errors.siren = errors.siren ? errors.siren : number(this.siren.split(" ").join(""));

        errors.carrierType = required(this.carrierType);
      }
    }

    let count = 0;
    Object.keys(errors).forEach(element => {
      if (errors[element]) {
        count++;
      }
    });
    if (count > 0) {
      console.log(count)
      throw {
        ...errors,
        message: 'signUp faild',
        _type: 1
      }
    }
    return true;
  }


  public async signIn(): Promise<void> {
    try {

      let error = null;
      this.validate();
      this.map();

      const res = await baseApi
        .url("/api/utilisateurs")
        .post({ ...this.data })
        .notFound(() => console.log("not Found"))
        .error(400, () => { error = "invalide input" })
        .json()
      //console.log(res);
      console.log("creating", res);
      console.log(error);
      if (error) { throw error };
      if (error) { throw error };
      if (!this.image) { return };
      console.log(this.image?.name);
      const resImg = await baseApi
        .url("/api/photo_profils")
        .formData({
          file: this.image
        })
        .post()
        .notFound(() => console.log("not Found"))
        .error(400, () => { error = "invalide input" })
        .json()
      console.log("uploading", resImg);
      console.log(error);
      if (error) { throw error };
      const update = await baseApi
        .url(res["@id"])
        .put({ image: resImg["@id"] })
        .notFound(() => console.log("not Found"))
        .error(400, () => { error = "invalide input" })
        .json()
      console.log("updating", update);
      console.log(error);
      if (error) { throw error };
    } catch (error) {
      if (error._type && error._type === 1) {
        throw error;
      } else {
        const e = { message: lang.formValidating.dupEmail };
        e["email"] = lang.formValidating.dupEmail;
        throw e;
      }
    }
  }
}