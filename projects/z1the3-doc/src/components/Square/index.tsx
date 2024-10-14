import styles from './styles.module.css';



export default function Squares() {


  return <>

    <div className={styles.container}>
      <div className={styles.squ1}></div>
    </div>
    <div style={{ width: 100, height: 100, position: 'relative' }}>
      <div className={styles.squ2}></div>
    </div>
  </>
}
