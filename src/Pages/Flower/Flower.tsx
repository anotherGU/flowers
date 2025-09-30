import styles from "./Flower.module.css";
import { useParams } from "react-router-dom";
import { flowers } from "../../flowers";

const Flower = () => {
  const { id } = useParams();

  const flower = flowers.find((item) => item.id === parseInt(id!));

  return (
    <div className={styles.wrapper}>
      <div className={styles.gallery__block}>
        <div className={styles.gallery}>
          <img src={flower?.fullImage} alt="" width={606.25} />
        </div>
      </div>
      <div className={styles.content__block}>
        <div className={styles.description__block}>
          <h2 className={styles.title}>{flower?.title}</h2>
          <p className={styles.price}>AED {flower?.price}00</p>
          <p className={styles.description}>{flower?.description}</p>
          <div className={styles.includes}>
            <p className={styles.includes__title}>Gift Set options include:</p>
            <ul className={styles.includes__list}>
              <li className={styles.includes__li}>* with Balloons 6pcs</li>
              <li className={styles.includes__li}>
                * with Box of Chocolates 25pcs
              </li>
              <li className={styles.includes__li}>
                * with Nutella Ganache Cake & Balloons 3pcs
              </li>
            </ul>
          </div>
          <p className={styles.approval}>
            <b>Video Approval:</b> To ensure your complete satisfaction, once
            your order has been arranged, your florist will send a video of your
            finished arrangement by Whatsapp or email for your approval, before
            delivery.
          </p>
        </div>
        <div className={styles.trustpilot}></div>
      </div>
    </div>
  );
};

export default Flower;
