import styles from "./Header.module.css";

const Header = () => {
  return (
    <div className={styles.header__wrapper}>
      <div className={styles.above}>
        <div className="container">
          <div className={styles.above__content}>
            <span>Outstanding Service</span>
            <span>Free Delivery to all Emirates*</span>
            <span>Video Approval on all orders</span>
          </div>
        </div>
      </div>

      <header>
        <div className={styles.contacts}>
          <div className={styles.medias}>
            <span className="icon" data-icon="facebook">
              <a href="https://www.facebook.com/Flowersae-678313478849207/?ref=hl">
                {" "}
                <svg
                  width="27"
                  height="27"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 120 120"
                >
                  <g id="facebook">
                    <path d="M57,27.73V38H72.83l-2.09,16H57V95H40.45V53.94H26.62V38H40.45V26.15C40.45,12.46,48.83,5,61,5h0a115.36,115.36,0,0,1,12.34.63V19.94H64.92C58.26,19.94,57,23.1,57,27.73Z"></path>
                  </g>
                </svg>
              </a>
            </span>
            <span className="icon" data-icon="instagram">
              <a href="https://www.instagram.com/flowers.ae/?ref=badge%22">
                <svg
                  width="27"
                  height="27"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 120 120"
                >
                  <g id="instagram">
                    <path d="M73.75,5H26.25A21.27,21.27,0,0,0,5,26.25v47.5A21.27,21.27,0,0,0,26.25,95h47.5A21.27,21.27,0,0,0,95,73.75V26.25A21.27,21.27,0,0,0,73.75,5Zm-8.6,60.13A21.43,21.43,0,1,1,71.44,50,21.4,21.4,0,0,1,65.15,65.13ZM81.9,29.34A7.62,7.62,0,1,1,84.14,24,7.59,7.59,0,0,1,81.9,29.34Z"></path>
                  </g>
                </svg>
              </a>
            </span>
            <span className="icon" data-icon="tiktok">
              <a href="https://www.tiktok.com/@flowers.ae">
                <svg
                  width="27"
                  height="27"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 3300 3900"
                  shape-rendering="geometricPrecision"
                  text-rendering="geometricPrecision"
                  image-rendering="optimizeQuality"
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                >
                  <path d="M2081 0c55 473 319 755 778 785v532c-266 26-499-61-770-225v995c0 1264-1378 1659-1932 753-356-583-138-1606 1004-1647v561c-87 14-180 36-265 65-254 86-398 247-358 531 77 544 1075 705 992-358V1h551z"></path>
                </svg>
              </a>
            </span>
          </div>
        </div>
        <div className={styles.logo}>
          <img
            src="//www.flowers.ae/cdn/shop/t/78/assets/black-logo.svg?v=99326736164169601421699422502"
            width="200"
            height="45"
            alt="Flowers AE Logo"
          ></img>
        </div>
        <div className={styles.search}></div>
      </header>
    </div>
  );
};

export default Header;
