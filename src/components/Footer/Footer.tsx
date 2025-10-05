import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Первая колонка */}
        <div className={styles.footerColumn}>
          <h3 className={styles.columnTitle}>Flowers.ae</h3>
          <ul className={styles.footerList}>
            <li>
              <a href="/delivery">Home</a>
            </li>
            <li>
              <a href="/info">About us</a>
            </li>
            <li>
              <a href="/services">Work for us</a>
            </li>
            <li>
              <a href="/events">Our Reviews</a>
            </li>
            <li>
              <a href="/occasion">Flower Blog</a>
            </li>
            <li>
              <a href="/collection">Flower Care</a>
            </li>
            <li>
              <a href="/collection">Contact Us</a>
            </li>
            <li>
              <a href="/collection">Press</a>
            </li>
          </ul>
        </div>

        {/* Вторая колонка */}
        <div className={styles.footerColumn}>
          <h3 className={styles.columnTitle}>Delivery</h3>
          <ul className={styles.footerList}>
            <li>
              <a href="/home">Dubai</a>
            </li>
            <li>
              <a href="/dubai">Abu Dhabi</a>
            </li>
            <li>
              <a href="/account">Sharjah</a>
            </li>
            <li>
              <a href="/corporate">Ajman</a>
            </li>
            <li>
              <a href="/mothers-day">Fujairah</a>
            </li>
            <li>
              <a href="/complete-range">Umm Al Quwain</a>
            </li>
            <li>
              <a href="/luxury">Ras Al Khaimah</a>
            </li>
          </ul>
        </div>

        {/* Третья колонка */}
        <div className={styles.footerColumn}>
          <h3 className={styles.columnTitle}>Info</h3>
          <ul className={styles.footerList}>
            <li>
              <a href="/about">My Account</a>
            </li>
            <li>
              <a href="/abu-dhabi">How To Order Flowers</a>
            </li>
            <li>
              <a href="/how-to-order">Customer Service</a>
            </li>
            <li>
              <a href="/wedding">Flower FAQ's</a>
            </li>
            <li>
              <a href="/uae-national-day">Terms and Conditions</a>
            </li>
          </ul>
        </div>

        {/* Четвертая колонка */}
        <div className={styles.footerColumn}>
          <h3 className={styles.columnTitle}>Services</h3>
          <ul className={styles.footerList}>
            <li>
              <a href="/work">Corporate Flowers</a>
            </li>
            <li>
              <a href="/sharjah">Wedding Flowers</a>
            </li>
            <li>
              <a href="/customer-service">Flowers For Your Home</a>
            </li>
            <li>
              <a href="/home-flowers">Bespoke Flowers</a>
            </li>
          </ul>
        </div>

        {/* Пятая колонка */}
        <div className={styles.footerColumn}>
          <h3 className={styles.columnTitle}>Upcoming Events</h3>
          <ul className={styles.footerList}>
            <li>
              <a href="/reviews">Mother's Day</a>
            </li>
            <li>
              <a href="/ajman">UAE National Day</a>
            </li>
            <li>
              <a href="/faq">Festive Flowers</a>
            </li>
          </ul>
        </div>

        {/* Шестая колонка */}
        <div className={styles.footerColumn}>
          <h3 className={styles.columnTitle}>Occasion</h3>
          <ul className={styles.footerList}>
            <li>
              <a href="/fujairah">Our Complete Range</a>
            </li>
            <li>
              <a href="/terms">Birthday Flowers</a>
            </li>
            <li>
              <a href="/welcome-back">New Baby Flowers</a>
            </li>
            <li>
              <a href="/letter">Anniversary Flowers</a>
            </li>
            <li>
              <a href="/care">Welcome Back Flowers</a>
            </li>
            <li>
              <a href="/umm-al-quwain">Congratulations Flowers</a>
            </li>
            <li>
              <a href="/condolence">Condolence Flowers</a>
            </li>
          </ul>
        </div>

        {/* Седьмая колонка */}
        <div className={styles.footerColumn}>
          <h3 className={styles.columnTitle}>Collection</h3>
          <ul className={styles.footerList}>
            <li>
              <a href="/basket">Basket Collection</a>
            </li>
            <li>
              <a href="/press">Luxury Collection</a>
            </li>
            <li>
              <a href="/ras-al-khaimah">Rose Collection</a>
            </li>
            <li>
              <a href="/orchid">Sunflower Collection</a>
            </li>
            <li>
              <a href="/contact">Hydrangea Collection</a>
            </li>
            <li>
              <a href="/contact">Letter Arrangements</a>
            </li>
            <li>
              <a href="/contact">Orchid Plants</a>
            </li>
            <li>
              <a href="/contact">Basket Collection</a>
            </li>
            <li>
              <a href="/contact">Hatbox Collection</a>
            </li>
            <li>
              <a href="/contact">Heartbox Collection</a>
            </li>
            <li>
              <a href="/contact">Extras</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
