import { useCallback, useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { formatDistance, parseISO } from 'date-fns';

// Define music options
interface MusicOption {
  id: string;
  name: string;
  file: string;
}

const musicOptions: MusicOption[] = [
  { id: 'angel', name: 'Happy Tune', file: '/assets/music/angelbabydj.mp3' },
  { id: 'happy', name: 'Birthday Celebration', file: '/assets/music/happy.mp3' },
  { id: 'jazzy', name: 'Jazzy Birthday', file: '/assets/music/jazzy.mp3' },
  { id: 'piano', name: 'Piano Birthday', file: '/assets/music/piano.mp3' }
];

function App() {
  // Customization settings - Edit these for personalization
  const recipientName = "Sarah";
  const birthdayMessage = `Happy Birthday, ${recipientName}! 🎂✨`;
  const loveMessage = `You're amazing, ${recipientName}! ❤️`;
  const giftQuestion = `Hey ${recipientName}, want a special gift today?`;
  const thankYouMessage = "YAY! Thank you for being so awesome! 🎁";
  const rejectMessage = `Alright ${recipientName}, maybe next time! 😜`;
  const photoUploadMessage = "Upload photos to make this gift special!";
  const photoConfirmMessage = `Great! Your ${recipientName}'s Gallery is ready!`;
  const galleryTitle = `${recipientName}'s Special Moments`;
  const messagePrompt = "Add your personal birthday message:";
  const maxPhotos = 5; // Maximum number of photos allowed

  // Set Sarah's birthday - format: YYYY-MM-DD
  const birthdayDate = "2025-05-15"; // Example date, modify as needed

  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  const [currentSticker, setCurrentSticker] = useState(1);
  const [mainText, setMainText] = useState('');
  const [buttonVisible, setButtonVisible] = useState(false);
  const [noResponse, setNoResponse] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [galleryView, setGalleryView] = useState(false);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [personalMessage, setPersonalMessage] = useState('');
  const [messageSubmitted, setMessageSubmitted] = useState(false);
  const [countdownText, setCountdownText] = useState('');
  const [showFullScreenGallery, setShowFullScreenGallery] = useState(false);
  const [showMusicSelector, setShowMusicSelector] = useState(false);
  const [currentMusic, setCurrentMusic] = useState(musicOptions[0]);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const clickEffectRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Update countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      try {
        const targetDate = parseISO(birthdayDate);
        const now = new Date();

        // Check if birthday already passed this year
        if (now > targetDate) {
          setCountdownText(`${recipientName}'s birthday has passed!`);
          return;
        }

        // Calculate time until birthday
        const timeUntil = formatDistance(targetDate, now, { addSuffix: true });
        setCountdownText(`${recipientName}'s birthday is ${timeUntil}!`);
      } catch (error) {
        console.error('Error calculating countdown:', error);
        setCountdownText('');
      }
    };

    // Update countdown immediately and then every minute
    updateCountdown();
    const intervalId = setInterval(updateCountdown, 60000);

    return () => clearInterval(intervalId);
    // These values are referenced in the updateCountdown function
    // but since they don't change, we don't need them in the dependency array
    // eslint-disable-next-line react-hooks/exhaustive-dependencies
  }, []);

  // Create click effect using useCallback to avoid dependency issues
  const createClickEffect = useCallback((e: MouseEvent) => {
    if (clickEffectRef.current) {
      const x = e.clientX;
      const y = e.clientY;

      clickEffectRef.current.style.left = `${x}px`;
      clickEffectRef.current.style.top = `${y}px`;
      clickEffectRef.current.style.width = '30px';
      clickEffectRef.current.style.height = '30px';

      clickEffectRef.current.classList.add('animate');

      setTimeout(() => {
        if (clickEffectRef.current) {
          clickEffectRef.current.classList.remove('animate');
        }
      }, 500);
    }
  }, []);

  useEffect(() => {
    // Add click effect to document
    document.addEventListener('click', createClickEffect);

    return () => {
      document.removeEventListener('click', createClickEffect);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [createClickEffect]);

  // Handle music change
  const handleMusicChange = useCallback((music: MusicOption) => {
    setCurrentMusic(music);

    if (audioRef.current) {
      // Store current playing state
      const wasPlaying = !audioRef.current.paused;

      // Update source
      audioRef.current.src = music.file;
      audioRef.current.load();

      // Resume playing if it was playing before
      if (wasPlaying) {
        audioRef.current.play().catch(err => {
          console.error("Audio couldn't play:", err);
        });
      }
    }
  }, []);

  // Toggle music play/pause
  const toggleMusic = useCallback(() => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play().then(() => {
          setIsMusicPlaying(true);
        }).catch(err => {
          console.error("Audio couldn't play:", err);
          setIsMusicPlaying(false);
        });
      } else {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      }
    }
  }, []);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(currentMusic.file);
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [currentMusic.file]);

  const handleStart = () => {
    setIsOverlayVisible(false);

    // Start audio
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsMusicPlaying(true);
      }).catch(err => {
        console.error("Audio couldn't play automatically:", err);
        setIsMusicPlaying(false);
      });
    }

    // Start animation sequence
    setTimeout(() => {
      setCurrentSticker(2);
      setMainText(giftQuestion);

      setTimeout(() => {
        setButtonVisible(true);
      }, 1000);
    }, 500);
  };

  const handleYes = () => {
    setButtonVisible(false);
    setCurrentSticker(3);
    setMainText(thankYouMessage);

    // Show photo upload after a delay
    setTimeout(() => {
      setMainText(photoUploadMessage);
      setShowPhotoUpload(true);
    }, 2000);
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Convert FileList to Array for easier handling
    const fileArray = Array.from(files);

    // Check if we'll exceed max photos
    const remainingSlots = maxPhotos - uploadedPhotos.length;
    const filesToProcess = fileArray.slice(0, remainingSlots);

    // Show a message if some photos were not added
    if (fileArray.length > remainingSlots) {
      alert(`You can only add ${maxPhotos} photos in total. Only the first ${remainingSlots} photos from your selection will be added.`);
    }

    // Process each file
    const processFiles = async () => {
      const newPhotos: string[] = [];

      for (const file of filesToProcess) {
        // Read the file as data URL
        const dataUrl = await readFileAsDataURL(file);
        newPhotos.push(dataUrl);
      }

      // Update state with new photos
      setUploadedPhotos(prev => [...prev, ...newPhotos]);

      // Reset the file input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    processFiles();
  };

  // Helper function to read file as data URL
  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleContinueWithPhotos = () => {
    setShowPhotoUpload(false);
    setMainText(photoConfirmMessage);
    setShowGallery(true);

    // Show message form after gallery
    setTimeout(() => {
      setGalleryView(true);

      setTimeout(() => {
        setShowMessageForm(true);
        setMainText(messagePrompt);
      }, 2000);
    }, 2000);
  };

  const handleSkipUpload = () => {
    setShowPhotoUpload(false);

    // Skip to message form
    setTimeout(() => {
      setShowMessageForm(true);
      setMainText(messagePrompt);
    }, 1000);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPersonalMessage(e.target.value);
  };

  const handleSubmitMessage = () => {
    setMessageSubmitted(true);
    setShowMessageForm(false);

    // Fire confetti
    if (confettiCanvasRef.current) {
      const canvas = confettiCanvasRef.current;

      // Fire confetti from the center
      confetti({
        particleCount: 150,
        spread: 160,
        origin: { y: 0.6, x: 0.5 },
        disableForReducedMotion: true
      });

      // Side confetti bursts
      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.5, x: 0.1 },
          disableForReducedMotion: true
        });
      }, 250);

      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.5, x: 0.9 },
          disableForReducedMotion: true
        });
      }, 400);
    }

    // Continue to birthday message
    setTimeout(() => {
      setCurrentSticker(4);
      setMainText(birthdayMessage);

      setTimeout(() => {
        setCurrentSticker(5);
        setMainText(loveMessage);
      }, 3000);
    }, 1000);
  };

  const handleSkipMessage = () => {
    setShowMessageForm(false);

    // Skip to next part of the sequence
    setTimeout(() => {
      setCurrentSticker(4);
      setMainText(birthdayMessage);

      setTimeout(() => {
        setCurrentSticker(5);
        setMainText(loveMessage);
      }, 3000);
    }, 1000);
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex(prev => (prev + 1) % uploadedPhotos.length);
  };

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex(prev => (prev - 1 + uploadedPhotos.length) % uploadedPhotos.length);
  };

  const toggleFullScreenGallery = () => {
    setShowFullScreenGallery(prev => !prev);
  };

  const handleNo = () => {
    setButtonVisible(false);
    setNoResponse(true);
  };

  const canAddMorePhotos = uploadedPhotos.length < maxPhotos;

  return (
    <>
      {isOverlayVisible && (
        <div className="overlay">
          <div className="cover">
            <p style={{ fontSize: '17px', fontWeight: 700, margin: 0 }}>
              Hey {recipientName}, open this for a moment 🥳
            </p>
            <div id="loveIn" className="initial" onClick={handleStart}>
              <img
                src="/assets/search.svg"
                alt=""
                width={25}
                height={25}
                style={{ width: '25px', height: '25px' }}
              />
              <label style={{ fontSize: '16px' }}>Click here</label>
            </div>

            {/* Countdown Timer */}
            {countdownText && (
              <div className="countdown-timer">
                {countdownText}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="swiper">
        <div className="mainMsg">
          <div className="mainSt">
            <img
              id="st1"
              src="/assets/st1.gif"
              className={currentSticker === 1 ? '' : 'hidden'}
              width={80}
              height={80}
              style={{ width: '80px', height: '80px' }}
            />
            <img
              id="st2"
              src="/assets/st2.gif"
              className={currentSticker === 2 ? '' : 'hidden'}
              width={240}
              height={240}
              style={{ width: '240px', height: '240px' }}
            />
            <img
              id="st3"
              src="/assets/st3.gif"
              className={currentSticker === 3 ? '' : 'hidden'}
              width={233}
              height={240}
              style={{ width: '233px', height: '240px' }}
            />
            <img
              id="st4"
              src="/assets/st4.gif"
              className={currentSticker === 4 && !galleryView ? '' : 'hidden'}
              width={232}
              height={240}
              style={{ width: '232px', height: '240px' }}
            />
            <img
              id="st5"
              src="/assets/st5.gif"
              className={currentSticker === 5 && !galleryView ? '' : 'hidden'}
              width={238}
              height={238}
              style={{ width: '238px', height: '238px' }}
            />

            {/* Display personal message if submitted */}
            {messageSubmitted && personalMessage && (
              <div className="personal-message-display">
                <h3>Your Birthday Message:</h3>
                <div className="message-content">
                  "{personalMessage}"
                </div>
              </div>
            )}

            {/* Photo Gallery */}
            {galleryView && uploadedPhotos.length > 0 && !showFullScreenGallery && (
              <div className="photo-gallery">
                <h3 className="gallery-title">{galleryTitle}</h3>

                <div className="gallery-container">
                  <button
                    className="gallery-nav prev"
                    onClick={handlePrevPhoto}
                    disabled={uploadedPhotos.length <= 1}
                  >
                    ❮
                  </button>

                  <div className="gallery-image-wrapper">
                    <img
                      src={uploadedPhotos[currentPhotoIndex]}
                      alt={`Gallery photo ${currentPhotoIndex + 1}`}
                      className="gallery-image"
                    />

                    <div className="gallery-counter">
                      {currentPhotoIndex + 1} / {uploadedPhotos.length}
                    </div>

                    {/* Fullscreen toggle button */}
                    <button
                      className="fullscreen-button"
                      onClick={toggleFullScreenGallery}
                      title="View fullscreen"
                    >
                      <img
                        src="/assets/icons/fullscreen.svg"
                        alt="Fullscreen"
                        width={24}
                        height={24}
                      />
                    </button>
                  </div>

                  <button
                    className="gallery-nav next"
                    onClick={handleNextPhoto}
                    disabled={uploadedPhotos.length <= 1}
                  >
                    ❯
                  </button>
                </div>

                <div className="gallery-thumbnails">
                  {uploadedPhotos.map((photo, index) => (
                    <div
                      key={`gallery-thumb-${photo.substring(0, 20)}-${index}`}
                      className={`gallery-thumbnail ${index === currentPhotoIndex ? 'active' : ''}`}
                      onClick={() => setCurrentPhotoIndex(index)}
                    >
                      <img
                        src={photo}
                        alt={`Thumbnail ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <span className="mainTxt">{mainText}</span>

          {/* Yes/No buttons */}
          <div id="button" className={buttonVisible ? '' : 'hidden'}>
            <button id="By" className="blue" onClick={handleYes}>Yes</button>
            <button id="Bn" className="red" onClick={handleNo}>No</button>
          </div>

          {/* Photo upload UI */}
          {showPhotoUpload && (
            <div className="photo-upload">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple
                style={{ display: 'none' }}
              />

              {/* Show thumbnails of uploaded photos */}
              {uploadedPhotos.length > 0 && (
                <div className="upload-preview">
                  {uploadedPhotos.map((photo, index) => (
                    <div key={`upload-preview-${photo.substring(0, 20)}-${index}`} className="thumbnail">
                      <img
                        src={photo}
                        alt={`Uploaded ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="upload-status">
                {uploadedPhotos.length > 0 ? (
                  <p>{uploadedPhotos.length} photo{uploadedPhotos.length !== 1 ? 's' : ''} added{canAddMorePhotos ? ` (${maxPhotos - uploadedPhotos.length} more allowed)` : ''}</p>
                ) : (
                  <p>No photos added yet. Add up to {maxPhotos} photos.</p>
                )}
              </div>

              <div className="upload-buttons">
                {canAddMorePhotos && (
                  <button
                    className="blue"
                    onClick={handleUploadClick}
                  >
                    Add Photo{uploadedPhotos.length > 0 ? 's' : ''}
                  </button>
                )}

                <button
                  className={uploadedPhotos.length > 0 ? "green" : "grey"}
                  onClick={handleContinueWithPhotos}
                  disabled={uploadedPhotos.length === 0}
                >
                  {uploadedPhotos.length > 0 ? "Continue with Photos" : "Add at least one photo"}
                </button>

                <button className="grey" onClick={handleSkipUpload}>Skip</button>
              </div>
            </div>
          )}

          {/* Message form */}
          {showMessageForm && (
            <div className="message-form">
              <textarea
                ref={textareaRef}
                value={personalMessage}
                onChange={handleMessageChange}
                placeholder="Write your birthday message here..."
                rows={4}
                maxLength={200}
                className="message-textarea"
              />

              <div className="message-counter">
                {personalMessage.length}/200 characters
              </div>

              <div className="upload-buttons">
                <button
                  className="green"
                  onClick={handleSubmitMessage}
                  disabled={personalMessage.trim().length === 0}
                >
                  Add Message
                </button>

                <button className="grey" onClick={handleSkipMessage}>
                  Skip
                </button>
              </div>
            </div>
          )}

          {/* No response */}
          <div className={noResponse ? '' : 'hidden'}>
            <span id="textNo">{rejectMessage}</span>
            <img
              id="stickerNo"
              src="/assets/stickerNo.gif"
              width={232}
              height={240}
              style={{ width: '232px', height: '240px' }}
            />
          </div>
        </div>
      </div>

      {/* Fullscreen Gallery */}
      {showFullScreenGallery && uploadedPhotos.length > 0 && (
        <div className="fullscreen-gallery">
          <div className="fullscreen-header">
            <h2>{galleryTitle}</h2>
            <button
              className="close-fullscreen"
              onClick={toggleFullScreenGallery}
            >
              <img
                src="/assets/icons/fullscreen-exit.svg"
                alt="Exit Fullscreen"
                width={24}
                height={24}
              />
            </button>
          </div>

          <div className="fullscreen-content">
            <button
              className="fullscreen-nav prev"
              onClick={handlePrevPhoto}
              disabled={uploadedPhotos.length <= 1}
            >
              ❮
            </button>

            <div className="fullscreen-image-container">
              <img
                src={uploadedPhotos[currentPhotoIndex]}
                alt={`Gallery photo ${currentPhotoIndex + 1}`}
                className="fullscreen-image"
              />
            </div>

            <button
              className="fullscreen-nav next"
              onClick={handleNextPhoto}
              disabled={uploadedPhotos.length <= 1}
            >
              ❯
            </button>
          </div>

          <div className="fullscreen-footer">
            <div className="fullscreen-counter">
              {currentPhotoIndex + 1} / {uploadedPhotos.length}
            </div>

            <div className="fullscreen-thumbnails">
              {uploadedPhotos.map((photo, index) => (
                <div
                  key={`fullscreen-thumb-${photo.substring(0, 20)}-${index}`}
                  className={`fullscreen-thumbnail ${index === currentPhotoIndex ? 'active' : ''}`}
                  onClick={() => setCurrentPhotoIndex(index)}
                >
                  <img
                    src={photo}
                    alt={`Thumbnail ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Music Controls */}
      {!isOverlayVisible && (
        <div className="music-controls">
          <button
            className="music-toggle"
            onClick={toggleMusic}
            title={isMusicPlaying ? "Pause music" : "Play music"}
          >
            <img
              src={isMusicPlaying ? "/assets/icons/pause.svg" : "/assets/icons/music.svg"}
              alt={isMusicPlaying ? "Pause" : "Play"}
              width={24}
              height={24}
            />
          </button>

          <button
            className="music-selector-toggle"
            onClick={() => setShowMusicSelector(prev => !prev)}
            title="Change music"
          >
            <span className="current-music-name">{currentMusic.name}</span>
          </button>

          {showMusicSelector && (
            <div className="music-options">
              {musicOptions.map(option => (
                <button
                  key={option.id}
                  className={`music-option ${option.id === currentMusic.id ? 'active' : ''}`}
                  onClick={() => {
                    handleMusicChange(option);
                    setShowMusicSelector(false);
                  }}
                >
                  {option.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Background animations */}
      <div>
        <div className="swrapper">
          <div className="box">
            <div />
            <div />
            <div />
            <div />
            <div />
          </div>
        </div>
      </div>

      {/* Click effect element */}
      <div ref={clickEffectRef} className="click-effect" />

      {/* Confetti canvas */}
      <canvas
        ref={confettiCanvasRef}
        className="confetti-canvas"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1000
        }}
      />
    </>
  );
}

export default App;
