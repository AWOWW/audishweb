import React, { useState, useRef, useEffect } from "react";
import { getFirestore, collection, addDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../firebase/firebase_web"; // firebase-web.js 파일에서 초기화된 app 가져오기
import "../styles/Register.css";

const db = getFirestore(app);
const storage = getStorage(app);

const categoryData = {
  한식: ["치킨", "분식", "기타"],
  일식: ["돈까스", "회", "기타"],
  중식: ["짜장짬뽕", "마라", "기타"],
  양식: ["피자햄버거", "파스타샐러드", "기타"],
  이국식당: ["베트남 식당", "멕시코 식당", "기타"],
  디저트: ["카페", "와플", "기타"],
};

function Register() {
  const [StoreName, setStoreName] = useState("");
  const [StoreAddress, setStoreAddress] = useState("");
  const storeAddressRef = useRef(null);
  const [StoreImage, setStoreImage] = useState(null);
  const [MainCategory, setMainCategory] = useState("한식");
  const [SubCategory, setSubCategory] = useState("치킨");

  const [MainMenus, setMainMenus] = useState([
    { name: "", price: "", options: [""], image: null },
  ]);

  const [BasicMenus, setBasicMenus] = useState([
    { name: "", price: "", options: [""], image: null },
  ]);

  const [SideMenus, setSideMenus] = useState([
    { name: "", price: "", image: null },
  ]);

  const [AtleastPrice, setAtleastPrice] = useState("");
  const [DeliveryFee, setDeliveryFee] = useState("");

  useEffect(() => {
    console.log("MainMenus:", MainMenus);
    console.log("BasicMenus:", BasicMenus);
    console.log("SideMenus:", SideMenus);
  }, [MainMenus, BasicMenus, SideMenus]);

  // 파일 입력 요소에 접근하기 위한 ref
  const storeImageRef = useRef(null);
  const mainMenuImageRefs = useRef([]);
  const basicMenuImageRefs = useRef([]);
  const sideMenuImageRefs = useRef([]); // sideMenuImageRefs 선언

  useEffect(() => {
    // 구글 지도 API 로드
    const script = document.createElement("script");
    //const apiKey = 'AIzaSyCLxPmW9IGQLm1SuvHxOdZBcKL7LzC5W0E';

    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCLxPmW9IGQLm1SuvHxOdZBcKL7LzC5W0E&libraries=places`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      const autocomplete = new window.google.maps.places.Autocomplete(
        storeAddressRef.current, // ref로 직접 DOM 요소 참조
        { types: ["geocode"] }
      );

      autocomplete.setFields(["formatted_address"]);
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place && place.formatted_address) {
          setStoreAddress(place.formatted_address); // 자동완성으로 주소 선택 시 상태 업데이트
        }
      });
    };
  }, []);

  const handleAddressChange = (e) => {
    const inputValue = e.target.value;
    setStoreAddress(inputValue); // 수동 입력된 주소도 상태로 설정
  };
  const handleAddMainMenu = () => {
    setMainMenus((prevMenus) => [
      ...prevMenus,
      { name: "", price: "", options: [""], image: null },
    ]);
  };

  const handleAddBasicMenu = () => {
    setBasicMenus((prevMenus) => [
      ...prevMenus,
      { name: "", price: "", options: [""], image: null },
    ]);
  };

  // 사이드 메뉴 추가 함수
  const handleAddSideMenu = () => {
    setSideMenus((prevMenus) => [
      ...prevMenus,
      { name: "", price: "", image: null },
    ]);
  };

  const handleRemoveMainMenu = (index) => {
    const newMainMenus = MainMenus.filter((_, i) => i !== index);

    setMainMenus(newMainMenus);

    mainMenuImageRefs.current.splice(index, 1);
  };

  const handleRemoveBasicMenu = (index) => {
    const newBasicMenus = BasicMenus.filter((_, i) => i !== index);

    setBasicMenus(newBasicMenus);

    basicMenuImageRefs.current.splice(index, 1);
  };

  // 사이드 메뉴 삭제 함수
  const handleRemoveSideMenu = (index) => {
    const newSideMenus = SideMenus.filter((_, i) => i !== index);
    setSideMenus(newSideMenus);
  };

  const handleMainMenuChange = (index, field, value) => {
    const newMainMenus = [...MainMenus];
    if (field === "image") {
      newMainMenus[index][field] = value.target.files[0];
    } else {
      newMainMenus[index][field] = value;
    }
    setMainMenus(newMainMenus);
  };

  const handleBasicMenuChange = (index, field, value) => {
    const newBasicMenus = [...BasicMenus];
    if (field === "image") {
      newBasicMenus[index][field] = value.target.files[0];
    } else {
      newBasicMenus[index][field] = value;
    }
    setBasicMenus(newBasicMenus);
  };

  const handleSideMenuChange = (index, field, value) => {
    const newSideMenus = [...SideMenus];
    if (field === "image") {
      newSideMenus[index][field] = value.target.files[0];
    } else {
      newSideMenus[index][field] = value;
    }
    setSideMenus(newSideMenus);
  };

  const handleAddOption = (menuIndex, menuType) => {
    if (menuType === "main") {
      const newMainMenus = [...MainMenus];
      newMainMenus[menuIndex].options.push("");
      setMainMenus(newMainMenus);
    } else {
      const newBasicMenus = [...BasicMenus];
      newBasicMenus[menuIndex].options.push("");
      setBasicMenus(newBasicMenus);
    }
  };

  const handleRemoveOption = (menuIndex, optionIndex, menuType) => {
    if (menuType === "main") {
      const newMainMenus = [...MainMenus];
      newMainMenus[menuIndex].options.splice(optionIndex, 1);
      setMainMenus(newMainMenus);
    } else if (menuType === "basic") {
      const newBasicMenus = [...BasicMenus];
      newBasicMenus[menuIndex].options.splice(optionIndex, 1);
      setBasicMenus(newBasicMenus);
    }
  };

  const handleOptionChange = (menuIndex, optionIndex, value, menuType) => {
    if (menuType === "main") {
      const newMainMenus = [...MainMenus];
      newMainMenus[menuIndex].options[optionIndex] = value;
      setMainMenus(newMainMenus);
    } else if (menuType === "basic") {
      const newBasicMenus = [...BasicMenus];
      newBasicMenus[menuIndex].options[optionIndex] = value;
      setBasicMenus(newBasicMenus);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const uploadImage = async (image) => {
      const fileRef = ref(storage, `images/${image.name}`);
      await uploadBytes(fileRef, image);
      return await getDownloadURL(fileRef);
    };

    const StoreImageUrl = StoreImage ? await uploadImage(StoreImage) : null;
    const MainMenusWithImages = await Promise.all(
      MainMenus.map(async (menu) => {
        const imageUrl = menu.image ? await uploadImage(menu.image) : null;
        return { ...menu, image: imageUrl };
      })
    );
    const BasicMenusWithImages = await Promise.all(
      BasicMenus.map(async (menu) => {
        const imageUrl = menu.image ? await uploadImage(menu.image) : null;
        return { ...menu, image: imageUrl };
      })
    );

    // 최상위 컬렉션 "Types of Food"에 카테고리 문서 추가 또는 참조
    const typesOfFoodCollectionRef = collection(db, "Types of Food");
    const categoryDocRef = doc(typesOfFoodCollectionRef, MainCategory);
    const subCategoryCollectionRef = collection(categoryDocRef, SubCategory);

    await addDoc(subCategoryCollectionRef, {
      StoreName,
      StoreAddress,
      StoreImage: StoreImageUrl,
      MainMenus: MainMenusWithImages,
      BasicMenus: BasicMenusWithImages,
      AtleastPrice,
      DeliveryFee,
    });
    //

    alert("Form submitted!");

    // 기존 초기화 코드
    setStoreName("");
    setStoreAddress("");
    setStoreImage(null);
    setMainCategory("한식");
    setSubCategory(categoryData["한식"][0]);
    setMainMenus([{ name: "", price: "", options: [""], image: null }]);
    setBasicMenus([{ name: "", price: "", options: [""], image: null }]);
    setSideMenus([{ name: "", price: "", image: null }]); // SideMenus 초기화 추가
    setAtleastPrice("");
    setDeliveryFee("");

    // 기존 파일 input 초기화 코드
    if (storeImageRef.current) storeImageRef.current.value = "";
    mainMenuImageRefs.current.forEach((ref) => {
      if (ref) ref.value = "";
    });
    basicMenuImageRefs.current.forEach((ref) => {
      if (ref) ref.value = "";
    });
    sideMenuImageRefs.current.forEach((ref) => {
      // SideMenus input 초기화 추가
      if (ref) ref.value = "";
    });
  };

  return (
    <div className="container">
      <h1>사장님의 가게를 등록해주세요!</h1>
      <form onSubmit={handleSubmit}>
        {/* 사장님 가게 정보 전체를 묶는 div */}
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            border: "2px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
            display: "flex",
            flexDirection: "column", // 수직 배치
            gap: "10px", // 요소 간 간격
          }}
        >
          <h2>사장님의 가게</h2>
          <label>가게 이름</label>
          <input
            type="text"
            placeholder="가게 이름"
            value={StoreName}
            onChange={(e) => setStoreName(e.target.value)}
            required
          />
          <label>가게 주소</label>
          <input
            id="store-address"
            type="text"
            placeholder="가게 주소"
            ref={storeAddressRef} // ref를 사용해 DOM 직접 참조
            value={StoreAddress} // 상태에 따라 값이 설정됨
            onChange={handleAddressChange} // 수동 입력 시 상태 업데이트
            required
          />
          <label>가게 이미지</label>
          <input
            type="file"
            ref={storeImageRef}
            onChange={(e) => setStoreImage(e.target.files[0])}
            //required
          />
          <label>음식 종류</label>
          <select
            value={MainCategory}
            onChange={(e) => {
              setMainCategory(e.target.value);
              setSubCategory(categoryData[e.target.value][0]);
            }}
            required
          >
            {Object.keys(categoryData).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <label>세부 음식 종류</label>
          <select
            value={SubCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            required
          >
            {categoryData[MainCategory].map((subcategory) => (
              <option key={subcategory} value={subcategory}>
                {subcategory}
              </option>
            ))}
          </select>
        </div>

        <h2>인기 메뉴</h2>
        {MainMenus &&
          Array.isArray(MainMenus) &&
          MainMenus.length > 0 &&
          MainMenus.map((menu, menuIndex) => (
            <div
              key={menuIndex}
              style={{
                marginBottom: "20px", // 메뉴 간격
                padding: "15px", // 내부 여백
                border: "2px solid #ccc", // 회색 테두리
                borderRadius: "8px", // 모서리 둥글게
                backgroundColor: "#f9f9f9", // 옅은 배경색
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <label>메뉴 이름</label>
                <input
                  type="text"
                  placeholder="메뉴 이름"
                  value={menu.name}
                  onChange={(e) =>
                    handleMainMenuChange(menuIndex, "name", e.target.value)
                  }
                  required
                />
                <label>메뉴 가격</label>
                <input
                  type="text"
                  placeholder="메뉴 가격"
                  value={menu.price}
                  onChange={(e) =>
                    handleMainMenuChange(menuIndex, "price", e.target.value)
                  }
                  required
                />
                <label>이미지 첨부</label>
                <input
                  type="file"
                  ref={(el) => (mainMenuImageRefs.current[menuIndex] = el)}
                  onChange={(e) => handleMainMenuChange(menuIndex, "image", e)}
                  //required
                />
              </div>

              {menu.options.map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <label>세부 선택</label>
                  <input
                    type="text"
                    placeholder="세부 선택"
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(
                        menuIndex,
                        optionIndex,
                        e.target.value,
                        "main"
                      )
                    }
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveOption(menuIndex, optionIndex, "main")
                    }
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#f75959",
                      color: "white",
                      border: "none",
                    }}
                  >
                    세부선택 삭제
                  </button>
                </div>
              ))}

              {/* 세부선택 추가 버튼 */}
              <div style={{ marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => handleAddOption(menuIndex, "main")}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#4f7ff6",
                    color: "white",
                    border: "none",
                  }}
                >
                  세부선택 추가
                </button>
              </div>
            </div>
          ))}

        {/* 전체 메뉴에 대한 추가/삭제 버튼 */}
        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={handleAddMainMenu}
            style={{
              padding: "12px",
              width: "50%",
              //backgroundColor: "blue",
              color: "white",
              border: "none",
            }}
          >
            추가
          </button>
          <button
            type="button"
            onClick={() => handleRemoveMainMenu(MainMenus.length - 1)} // 마지막 메뉴 삭제
            style={{
              padding: "12px",
              width: "50%",
              backgroundColor: "#da1010",
              color: "white",
              border: "none",
            }}
          >
            삭제
          </button>
        </div>

        <h2>기본 메뉴</h2>
        {BasicMenus &&
          Array.isArray(BasicMenus) &&
          BasicMenus.length > 0 &&
          BasicMenus.map((menu, menuIndex) => (
            <div
              key={menuIndex}
              style={{
                marginBottom: "20px", // 메뉴 간격
                padding: "15px", // 내부 여백
                border: "2px solid #ccc", // 회색 테두리
                borderRadius: "8px", // 모서리 둥글게
                backgroundColor: "#f9f9f9", // 옅은 배경색
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <label>메뉴 이름</label>
                <input
                  type="text"
                  placeholder="메뉴 이름"
                  value={menu.name}
                  onChange={(e) =>
                    handleBasicMenuChange(menuIndex, "name", e.target.value)
                  }
                  required
                />
                <label>메뉴 가격</label>
                <input
                  type="text"
                  placeholder="메뉴 가격"
                  value={menu.price}
                  onChange={(e) =>
                    handleBasicMenuChange(menuIndex, "price", e.target.value)
                  }
                  required
                />
                <label>이미지 첨부</label>
                <input
                  type="file"
                  ref={(el) => (basicMenuImageRefs.current[menuIndex] = el)}
                  onChange={(e) => handleBasicMenuChange(menuIndex, "image", e)}
                  //required
                />
              </div>

              {menu.options.map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <label>세부 선택</label>
                  <input
                    type="text"
                    placeholder="세부 선택"
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(
                        menuIndex,
                        optionIndex,
                        e.target.value,
                        "basic"
                      )
                    }
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveOption(menuIndex, optionIndex, "basic")
                    }
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#f75959",
                      color: "white",
                      border: "none",
                    }}
                  >
                    세부선택 삭제
                  </button>
                </div>
              ))}

              {/* 세부선택 추가 버튼 */}
              <div style={{ marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => handleAddOption(menuIndex, "basic")}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#4f7ff6",
                    color: "white",
                    border: "none",
                  }}
                >
                  세부선택 추가
                </button>
              </div>
            </div>
          ))}

        {/* 전체 메뉴에 대한 추가/삭제 버튼 */}
        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={handleAddBasicMenu}
            style={{
              padding: "12px",
              width: "50%",
              color: "white",
              border: "none",
            }}
          >
            추가
          </button>
          <button
            type="button"
            onClick={() => handleRemoveBasicMenu(BasicMenus.length - 1)} // 마지막 메뉴 삭제
            style={{
              padding: "12px",
              width: "50%",
              backgroundColor: "#da1010",
              color: "white",
              border: "none",
            }}
          >
            삭제
          </button>
        </div>

        <h2>사이드 메뉴</h2>
        {SideMenus &&
          Array.isArray(SideMenus) &&
          SideMenus.length > 0 &&
          SideMenus.map((menu, menuIndex) => (
            <div
              key={menuIndex}
              style={{
                marginBottom: "20px", // 메뉴 간격
                padding: "15px", // 내부 여백
                border: "2px solid #ccc", // 회색 테두리
                borderRadius: "8px", // 모서리 둥글게
                backgroundColor: "#f9f9f9", // 옅은 배경색
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <label>메뉴 이름</label>
                <input
                  type="text"
                  placeholder="메뉴 이름"
                  value={menu.name}
                  onChange={(e) =>
                    handleSideMenuChange(menuIndex, "name", e.target.value)
                  }
                  required
                />
                <label>메뉴 가격</label>
                <input
                  type="text"
                  placeholder="메뉴 가격"
                  value={menu.price}
                  onChange={(e) =>
                    handleSideMenuChange(menuIndex, "price", e.target.value)
                  }
                  required
                />
                <label>이미지 첨부</label>
                <input
                  type="file"
                  ref={(el) => (sideMenuImageRefs.current[menuIndex] = el)}
                  onChange={(e) => handleSideMenuChange(menuIndex, "image", e)}
                  //required
                />
              </div>
            </div>
          ))}

        {/* 전체 메뉴에 대한 추가/삭제 버튼 */}
        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={handleAddSideMenu}
            style={{
              padding: "12px",
              width: "50%",
              //backgroundColor: "blue",
              color: "white",
              border: "none",
            }}
          >
            추가
          </button>
          <button
            type="button"
            onClick={() => handleRemoveSideMenu(SideMenus.length - 1)} // 마지막 메뉴 삭제
            style={{
              padding: "12px",
              width: "50%",
              backgroundColor: "#da1010",
              color: "white",
              border: "none",
            }}
          >
            삭제
          </button>
        </div>

        <h2>최소 주문 금액</h2>
        <input
          type="text"
          placeholder="최소 주문 금액"
          value={AtleastPrice}
          onChange={(e) => setAtleastPrice(e.target.value)}
          required
        />
        <h2>배달비</h2>
        <input
          type="text"
          placeholder="배달비"
          value={DeliveryFee}
          onChange={(e) => setDeliveryFee(e.target.value)}
          required
        />
        <button type="submit">제출</button>
      </form>
    </div>
  );
}

export default Register;
