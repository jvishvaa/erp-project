import { useRef, useState, useEffect, useCallback } from "react";

const useGallary = (images) => {
  const slidesContainer = useRef();

  const [slides, setSlides] = useState(null);

  const slidesPaginationContainer = useRef();
  const [slidesPagination, setSlidesPagination] = useState(null);

  const [{ oldIndex, currentIndex }, setIndex] = useState({
    oldIndex: 1,
    currentIndex: 0
  });

  const setFocusPaginationImage = () => {
    if (slidesPagination) {
      slidesPagination[currentIndex].firstChild.classList.add(
        "Gallary__imagePagination_active"
      );

      slidesPagination[oldIndex].firstChild.classList.remove(
        "Gallary__imagePagination_active"
      );
    }
  };

  useEffect(() => {
    if(slidesContainer?.length !== undefined){
        setSlides([...slidesContainer.current.children]);
        setSlidesPagination([...slidesPaginationContainer.current.children]);

    }

    // setFocusPaginationImage([...slidesPaginationContainer.current.children], 0);
  }, [slidesContainer, slidesPaginationContainer]);

  useEffect(() => {
    if (oldIndex !== null) {
      setFocusPaginationImage();
    } else {
      slidesPagination.forEach((slides, index) => {
        index === currentIndex
          ? slides.firstChild.classList.add("Gallary__imagePagination_active")
          : slides.firstChild.classList.remove(
              "Gallary__imagePagination_active"
            );
      });
    }
  }, [slidesPagination, currentIndex, oldIndex]);

  const scrollTo = useCallback(
    (index) => {
      setIndex({ currentIndex: index, oldIndex: null });
      slides[index].scrollIntoView({ behavior: "smooth" });
    },

    [slides]
  );

  const slideBack = () => {
    if (currentIndex > 0) {
      setTimeout(() => {
        slides[currentIndex - 1].scrollIntoView({ behavior: "smooth" });
      }, 220);

      slidesPagination[currentIndex - 1].scrollIntoView({ behavior: "smooth" });

      setIndex({ oldIndex: currentIndex, currentIndex: currentIndex - 1 });
    }
  };

  const slideNext = () => {
    if (currentIndex < slides.length - 1) {
      setTimeout(() => {
        slides[currentIndex + 1].scrollIntoView({ behavior: "smooth" });
      }, 220);
      slidesPagination[currentIndex + 1].scrollIntoView({ behavior: "smooth" });
      setIndex({ oldIndex: currentIndex, currentIndex: currentIndex + 1 });
    }
  };

  return {
    gallaryContainers: { slidesContainer, slidesPaginationContainer },

    gallaryHandlers: { scrollTo, slideBack, slideNext }
  };
};

export { useGallary };
