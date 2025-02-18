import styles from "./register.module.scss";
import { api } from "../../../services/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Register() {
  async function handleRegister(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const type = formData.get("type") as string;
    const photo = formData.get("photo") as File | null;

    if (name === "" || email === "" || password === "" || type === "") {
      console.log("Preencha todos os campos");
      return;
    }

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("name", name);
      formDataUpload.append("email", email);
      formDataUpload.append("password", password);
      formDataUpload.append("type", type);

      if (photo) {
        formDataUpload.append("file", photo);
      }

      await api.post("http://localhost:4000/users", formDataUpload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      
    } catch (error) {
      console.log(error);
    }

    redirect("/");
  }

  return (
    <>
      <div className={styles.container}>
        <section className={styles.register}>
          {/* <Image src={} alt="logo"/> */}
          <h1>Faça seu cadastro para continuar</h1>
          <form action={handleRegister}>
            <input
              type="text"
              placeholder="Digite seu nome"
              name="name"
              className={styles.input}
            />

            <input
              type="email"
              placeholder="Digite seu e-mail"
              name="email"
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Digite sua senha"
              name="password"
              className={styles.input}
            />

            <div className={styles.group}>
              <select name="type" className={styles.input}>
                <option value="patient">Recepcionista</option>
                <option value="doctor">Médico</option>
              </select>
              <label className={styles.fileLabel}>
                Selecione sua foto
                <input type="file" name="photo" className={styles.fileInput} />
              </label>
            </div>
            <button className={styles.button}>Acessar</button>
          </form>
          <Link href="/auth/login" className={styles.text}>
            Já possui uma conta? Entre
          </Link>
        </section>
      </div>
    </>
  );
}
