import styles from "./login.module.scss";
import { api } from "../../../services/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  async function handleLogin(formData: FormData) {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (email === "" || password === "") {
      return;
    }

    try {
      const response = await api.post("/users/login", {
        email,
        password,
      });

      if (!response.data.token) {
        return;
      }

      const expressTime = 60 * 60 * 24 * 30; // 30 days
      const cookieStore = await cookies();
      cookieStore.set("login", response.data.token, {
        maxAge: expressTime,
        path: "/",
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        
      });
    } catch (error) {
      console.log(error);
    }

    redirect("/");
  }

  return (
    <>
      <div className={styles.container}>
        <section className={styles.login}>
          {/* <Image src={} alt="logo"/> */}
          <h1>Faça login para continuar</h1>
          <form action={handleLogin}>
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
            <button className={styles.button}>Acessar</button>
          </form>
          <Link href="/auth/register" className={styles.text}>
            Não possui uma conta? Cadastre-se
          </Link>
          
        </section>
      </div>
    </>
  );
}
