import styles from "./page.module.scss";
import Login from "./auth/login/page";
import Register from "./auth/register/page";
import Link from "next/link";


export default function Home() {
  return (
    <div className={styles.container}>

      <section className={styles.welcome}>

        <h1>Bem vindo ao Sistema</h1>
        <p>Faça login ou registre-se para continuar</p>

        <Link href="/auth/login">
          <button className={styles.button}>Login</button>
        </Link>

        <Link href="/auth/register">
          <button className={styles.button}>Registre-se</button>
        </Link>

      </section>
      
    </div>
  );
}