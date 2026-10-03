/* =========================================================
   KUSUU ♡ NAAGII — VINTAGE LOVE MAGAZINE
   Page Flip + Music + Video + Mobile Swipe
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const openingScreen = document.getElementById("openingScreen");
    const openMagazine = document.getElementById("openMagazine");

    const magazine = document.getElementById("magazine");
    const book = document.getElementById("book");

    const pages = Array.from(document.querySelectorAll(".page"));

    const previousPage = document.getElementById("previousPage");
    const nextPage = document.getElementById("nextPage");
    const currentPage = document.getElementById("currentPage");

    const totalPages = pages.length;

    let pageIndex = 0;
    let magazineOpened = false;
    let isFlipping = false;

    /* =====================================================
       INITIAL STATE
    ===================================================== */

    pages.forEach((page, index) => {
        page.classList.remove("flipped");

        /*
         * Make sure the pages are stacked correctly.
         * First page stays on top, last page stays at bottom.
         */
        page.style.zIndex = totalPages - index;
    });

    updateControls();


    /* =====================================================
       OPEN MAGAZINE
    ===================================================== */

    if (openMagazine) {
        openMagazine.addEventListener("click", () => {

            if (magazineOpened) return;

            magazineOpened = true;

            openingScreen.classList.add("hide");

            setTimeout(() => {
                magazine.classList.add("show");
            }, 250);

            setTimeout(() => {
                openingScreen.style.display = "none";
            }, 1100);
        });
    }


    /* =====================================================
       NEXT PAGE
    ===================================================== */

    function goNext() {

        if (!magazineOpened) return;
        if (isFlipping) return;

        if (pageIndex >= totalPages - 1) {
            return;
        }

        isFlipping = true;

        const page = pages[pageIndex];

        page.classList.add("flipped");

        pageIndex++;

        updateControls();

        setTimeout(() => {
            isFlipping = false;
        }, 850);
    }


    /* =====================================================
       PREVIOUS PAGE
    ===================================================== */

    function goPrevious() {

        if (!magazineOpened) return;
        if (isFlipping) return;

        if (pageIndex <= 0) {
            return;
        }

        isFlipping = true;

        pageIndex--;

        const page = pages[pageIndex];

        page.classList.remove("flipped");

        updateControls();

        setTimeout(() => {
            isFlipping = false;
        }, 850);
    }


    /* =====================================================
       BUTTON CONTROLS
    ===================================================== */

    if (nextPage) {
        nextPage.addEventListener("click", (event) => {
            event.stopPropagation();
            goNext();
        });
    }

    if (previousPage) {
        previousPage.addEventListener("click", (event) => {
            event.stopPropagation();
            goPrevious();
        });
    }


    /* =====================================================
       PAGE COUNTER
    ===================================================== */

    function updateControls() {

        /*
         * pageIndex 0 = Page 1
         * pageIndex 1 = Page 2
         * etc.
         */

        if (currentPage) {
            currentPage.textContent = `${pageIndex + 1} / ${totalPages}`;
        }

        if (previousPage) {
            previousPage.disabled = pageIndex === 0;

            previousPage.style.opacity =
                pageIndex === 0 ? "0.35" : "1";
        }

        if (nextPage) {
            nextPage.disabled =
                pageIndex === totalPages - 1;

            nextPage.style.opacity =
                pageIndex === totalPages - 1 ? "0.35" : "1";
        }
    }


    /* =====================================================
       KEYBOARD NAVIGATION
    ===================================================== */

    document.addEventListener("keydown", (event) => {

        if (!magazineOpened) return;

        /*
         * Don't change pages while typing into something.
         */

        const active = document.activeElement;

        if (
            active &&
            (
                active.tagName === "INPUT" ||
                active.tagName === "TEXTAREA" ||
                active.tagName === "SELECT"
            )
        ) {
            return;
        }

        if (
            event.key === "ArrowRight" ||
            event.key === "ArrowDown" ||
            event.key === " "
        ) {
            event.preventDefault();
            goNext();
        }

        if (
            event.key === "ArrowLeft" ||
            event.key === "ArrowUp"
        ) {
            event.preventDefault();
            goPrevious();
        }
    });


    /* =====================================================
       TOUCH / SWIPE
    ===================================================== */

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    const minimumSwipeDistance = 55;

    if (book) {

        book.addEventListener(
            "touchstart",
            (event) => {

                if (!magazineOpened) return;

                /*
                 * Don't start page swipe when touching
                 * an audio/video control.
                 */

                const target = event.target;

                if (
                    target.closest("audio") ||
                    target.closest("video") ||
                    target.closest("button")
                ) {
                    touchStartX = 0;
                    touchStartY = 0;
                    return;
                }

                const touch = event.changedTouches[0];

                touchStartX = touch.clientX;
                touchStartY = touch.clientY;
            },
            { passive: true }
        );


        book.addEventListener(
            "touchend",
            (event) => {

                if (!magazineOpened) return;

                if (
                    touchStartX === 0 &&
                    touchStartY === 0
                ) {
                    return;
                }

                const target = event.target;

                if (
                    target.closest("audio") ||
                    target.closest("video") ||
                    target.closest("button")
                ) {
                    touchStartX = 0;
                    touchStartY = 0;
                    return;
                }

                const touch = event.changedTouches[0];

                touchEndX = touch.clientX;
                touchEndY = touch.clientY;

                handleSwipe();

                touchStartX = 0;
                touchStartY = 0;
            },
            { passive: true }
        );
    }


    function handleSwipe() {

        const differenceX = touchEndX - touchStartX;
        const differenceY = touchEndY - touchStartY;

        /*
         * Ignore mostly vertical swipes.
         */

        if (
            Math.abs(differenceX) <
            Math.abs(differenceY)
        ) {
            return;
        }

        if (
            Math.abs(differenceX) <
            minimumSwipeDistance
        ) {
            return;
        }

        /*
         * Swipe LEFT = next page
         * Swipe RIGHT = previous page
         */

        if (differenceX < 0) {
            goNext();
        } else {
            goPrevious();
        }
    }


    /* =====================================================
       CLICK LEFT / RIGHT SIDE OF PAGE
    ===================================================== */

    if (book) {

        book.addEventListener("click", (event) => {

            if (!magazineOpened) return;

            /*
             * Don't turn the page when clicking:
             * - videos
             * - audio players
             * - buttons
             * - links
             */

            if (
                event.target.closest("video") ||
                event.target.closest("audio") ||
                event.target.closest("button") ||
                event.target.closest("a")
            ) {
                return;
            }

            const rect = book.getBoundingClientRect();

            const clickX =
                event.clientX - rect.left;

            const middle =
                rect.width / 2;

            /*
             * Clicking right side = next
             * Clicking left side = previous
             */

            if (clickX > middle) {
                goNext();
            } else {
                goPrevious();
            }
        });
    }


    /* =====================================================
       VIDEO SETTINGS
    ===================================================== */

    const videos = document.querySelectorAll("video");

    videos.forEach((video) => {

        /*
         * Prevent videos from continuing to play
         * while turning pages.
         */

        video.addEventListener("play", () => {

            videos.forEach((otherVideo) => {

                if (
                    otherVideo !== video &&
                    !otherVideo.paused
                ) {
                    otherVideo.pause();
                }

            });

        });

        /*
         * Stop click/swipe events from reaching
         * the magazine itself.
         */

        video.addEventListener("click", (event) => {
            event.stopPropagation();
        });

        video.addEventListener("touchstart", (event) => {
            event.stopPropagation();
        }, { passive: true });
    });


    /* =====================================================
       AUDIO SETTINGS
    ===================================================== */

    const audioPlayers =
        document.querySelectorAll("audio");

    audioPlayers.forEach((audio) => {

        /*
         * Only one song plays at a time.
         */

        audio.addEventListener("play", () => {

            audioPlayers.forEach((otherAudio) => {

                if (
                    otherAudio !== audio &&
                    !otherAudio.paused
                ) {
                    otherAudio.pause();
                }

            });

        });

        /*
         * Don't turn magazine pages when
         * touching the audio player.
         */

        audio.addEventListener("click", (event) => {
            event.stopPropagation();
        });

        audio.addEventListener("touchstart", (event) => {
            event.stopPropagation();
        }, { passive: true });
    });


    /* =====================================================
       PAUSE MEDIA WHEN CHANGING PAGE
    ===================================================== */

    function pauseHiddenMedia() {

        videos.forEach((video) => {

            const page = video.closest(".page");

            if (!page) return;

            if (page.classList.contains("flipped")) {
                video.pause();
            }

        });

        audioPlayers.forEach((audio) => {

            const page = audio.closest(".page");

            if (!page) return;

            if (page.classList.contains("flipped")) {
                audio.pause();
            }

        });
    }


    /*
     * Run after every page change.
     */

    const originalGoNext = goNext;

    /* =====================================================
       UPDATE AFTER FLIP
    ===================================================== */

    setInterval(() => {

        if (!magazineOpened) return;

        pauseHiddenMedia();

    }, 1000);


    /* =====================================================
       PREVENT ACCIDENTAL DRAGGING OF PHOTOS
    ===================================================== */

    const images = document.querySelectorAll("img");

    images.forEach((image) => {

        image.addEventListener("dragstart", (event) => {
            event.preventDefault();
        });

    });


    /* =====================================================
       PAGE FLIP SOUND
    ===================================================== */

    let audioContext = null;

    function playPageSound() {

        /*
         * Browser may block AudioContext until
         * user interaction. Since page navigation
         * itself is a user interaction, this is safe.
         */

        try {

            if (!audioContext) {
                audioContext =
                    new (
                        window.AudioContext ||
                        window.webkitAudioContext
                    )();
            }

            const oscillator =
                audioContext.createOscillator();

            const gain =
                audioContext.createGain();

            oscillator.type = "triangle";

            oscillator.frequency.setValueAtTime(
                130,
                audioContext.currentTime
            );

            oscillator.frequency.exponentialRampToValueAtTime(
                65,
                audioContext.currentTime + 0.08
            );

            gain.gain.setValueAtTime(
                0.025,
                audioContext.currentTime
            );

            gain.gain.exponentialRampToValueAtTime(
                0.001,
                audioContext.currentTime + 0.1
            );

            oscillator.connect(gain);
            gain.connect(audioContext.destination);

            oscillator.start();

            oscillator.stop(
                audioContext.currentTime + 0.1
            );

        } catch (error) {
            /*
             * If browser blocks the tiny page sound,
             * the magazine still works normally.
             */
        }
    }


    /*
     * Add page sound to navigation.
     */

    if (nextPage) {

        nextPage.addEventListener(
            "click",
            () => {
                playPageSound();
            }
        );

    }

    if (previousPage) {

        previousPage.addEventListener(
            "click",
            () => {
                playPageSound();
            }
        );

    }


    /* =====================================================
       PAGE TURN WITH CLICK AREA
    ===================================================== */

    /*
     * Add subtle cursor indication on desktop.
     */

    if (book) {

        book.addEventListener("mousemove", (event) => {

            if (!magazineOpened) return;

            const rect =
                book.getBoundingClientRect();

            const x =
                event.clientX - rect.left;

            if (x > rect.width / 2) {
                book.style.cursor =
                    pageIndex < totalPages - 1
                        ? "e-resize"
                        : "default";
            } else {
                book.style.cursor =
                    pageIndex > 0
                        ? "w-resize"
                        : "default";
            }

        });

    }


    /* =====================================================
       OPENING SCREEN ENTER KEY
    ===================================================== */

    document.addEventListener("keydown", (event) => {

        if (
            !magazineOpened &&
            (
                event.key === "Enter" ||
                event.key === " "
            )
        ) {

            event.preventDefault();

            if (openMagazine) {
                openMagazine.click();
            }

        }

    });


    /* =====================================================
       VISIBILITY CHANGE
    ===================================================== */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (document.hidden) {

                videos.forEach((video) => {
                    video.pause();
                });

                audioPlayers.forEach((audio) => {
                    audio.pause();
                });

            }

        }
    );


    /* =====================================================
       FINAL INITIALIZATION
    ===================================================== */

    updateControls();

    console.log(
        `Kusuu ♡ Naagii Magazine loaded — ${totalPages} pages`
    );

});
