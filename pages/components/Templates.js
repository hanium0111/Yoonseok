import { useEffect, useState } from "react";
import styles from "./Templates.module.css";
import { FaEllipsisV, FaHeart, FaSearch } from "react-icons/fa";
import Image from "next/image";
import Btn from "./Btn";
import Link from "next/link";
import Modal from "react-modal";

export default function Templates({ showMoreButton, showCategories }) {
  const [templates, setTemplates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("모든 카테고리");
  const [sortOrder, setSortOrder] = useState("최신순");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [pageName, setPageName] = useState("");

  useEffect(() => {
    const fetchTemplates = async () => {
      const res = await fetch("/api/data?filename=templates");
      const data = await res.json();
      setTemplates(data);
    };

    fetchTemplates();
  }, []);

  const categories = [
    "모든 카테고리",
    "웹 디자인",
    "포트폴리오",
    "이커머스",
    "블로그",
    "포럼",
    "포토 갤러리",
    "기업",
    "제품 소개",
    "이벤트",
    "뉴스레터",
    "커뮤니티",
    "비즈니스",
  ];

  const filteredTemplates = templates
    .filter(
      (template) =>
        selectedCategory === "모든 카테고리" ||
        template.category === selectedCategory
    )
    .filter((template) =>
      template.templateName.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const sortedTemplates = filteredTemplates.sort((a, b) => {
    if (sortOrder === "최신순") {
      return new Date(b.date) - new Date(a.date);
    } else if (sortOrder === "인기순") {
      return b.likes - a.likes;
    }
    return 0;
  });

  const openModal = () => {
    setModalContent("페이지 이름을 입력해주세요!");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const pageNameInputValue = ({ input }) => {
    setPageName(input);
  };

  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    content: {
      width: "500px",
      height: "270px",
      margin: "auto",
      borderRadius: "10px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
      padding: "20px",
    },
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <form>
          <h1 className={styles.tempform}>템플릿 이름이랑 연결할 예정</h1>
          <p className={styles.tempcoment}>{modalContent}</p>
          <div>
            <input
              className={styles.pageinputform}
              type="text"
              onChange={(e) => setPageName(e.target.value)}
            />
            <button
              className={styles.okbutton}
              onClick={() => pageNameInputValue(pageName)}
            >
              확인
            </button>
            <button className={styles.closebutton} onClick={closeModal}>
              닫기
            </button>
          </div>
        </form>
      </Modal>
      <section className={styles.section}>
        {showCategories && (
          <div className={styles.categoriesWrapper}>
            <div className={styles.searchWrap}>
              <div className={styles.searchBox}>
                <FaSearch className={styles.searchIcon} />
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="검색어를 입력하세요 ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.categories}>
              {categories.map((category) => (
                <div
                  key={category}
                  className={`${styles.category} ${
                    selectedCategory === category ? styles.activeCategory : ""
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className={styles.sectionHeader}>
          <div className={styles.sectionLeft}>
            <h2 className={styles.sectionTitle}>템플릿 탐색</h2>
            {showMoreButton && (
              <Link href={"/temp"} legacyBehavior>
                <a>
                  <Btn
                    text={"더보기"}
                    background={"none"}
                    border={"none"}
                    textColor={"#000"}
                    textBorder={true}
                  />
                </a>
              </Link>
            )}
          </div>
          <div className={styles.sectionRight}>
            <Btn
              text={"최신순"}
              background={sortOrder === "최신순" ? "#4629F2" : "#fff"}
              border={"#4629F2"}
              textColor={sortOrder === "최신순" ? "#fff" : "#4629F2"}
              onClick={() => setSortOrder("최신순")}
            />
            <Btn
              text={"인기순"}
              background={sortOrder === "인기순" ? "#4629F2" : "#fff"}
              border={"#4629F2"}
              textColor={sortOrder === "인기순" ? "#fff" : "#4629F2"}
              onClick={() => setSortOrder("인기순")}
            />
          </div>
        </div>
        <div className={styles.grid}>
          {sortedTemplates.map((template) => (
            <div key={template.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardProfileWrap}>
                  <div className={styles.cardProfile}>
                    <Image
                      className={styles.cardProfileImg}
                      alt="profile"
                      layout="fill"
                      src={template.profileImage}
                    />
                  </div>
                </div>
                <div className={styles.cardHeaderInfo}>
                  <div className={styles.cardUser}>{template.user}</div>
                </div>
                <div className={styles.cardMenu}>
                  <button className={styles.cardMenuButton}>
                    <FaEllipsisV />
                  </button>
                </div>
              </div>
              <div className={styles.cardImage}></div>
              <div className={styles.cardContent}>
                <div className={styles.cardTitle}>{template.templateName}</div>
                <div className={styles.cardSubhead}>{template.date}</div>
                <p>{template.description}</p>
              </div>
              <div className={styles.cardFooter}>
                <Btn
                  icon={<FaHeart className={styles.likeIcon} />}
                  text={template.likes}
                  background={"none"}
                  border={"#4629F2"}
                  textColor={"#4629F2"}
                />
                <Btn
                  text={"템플릿 사용"}
                  background={"#4629F2"}
                  border={"#4629F2"}
                  textColor={"#fff"}
                  width="7rem"
                  onClick={openModal}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
