import React, { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import { useLanguage } from "../context/LanguageContext"; // Import lokalizace
import BottomMenu from '../components/BottomMenu';
import UserStats from '../components/UserStats';
import Achievements from '../components/Achivements';
import ProfileCountries from '../components/ProfileCountries';
import "../styles/pagesStyles/ProfilePage.scss";

const ProfilePage = () => {
  const { user } = useAuth(); 
  const { settings, updateSettings } = useSettings(); 
  const { t } = useLanguage(); // Využití lokalizačního překladu
  
  // Stavy pro ovládání modálních oken a souborů
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Stavy pro transformaci (Zoom a Pan)
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null; 

  // Fix pro "UN" -> pokud chybí celé jméno, použije se username, případně fallback "User"
  const safeNameForAvatar = user.fullName || user.username || "User";
  const avatarUrl = settings?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(safeNameForAvatar)}&background=random&size=150`;

  const handleAvatarClick = () => {
    setIsMenuOpen(true);
  };

  const triggerFileInput = () => {
    setIsMenuOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setZoom(1); 
        setOffset({ x: 0, y: 0 }); // Reset pozice pro nový obrázek
        setIsCropOpen(true);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  };

  // Odstranění fotky (Návrat k výchozímu stavu generovanému z iniciálů)
  const handleRemovePhoto = async () => {
    setIsMenuOpen(false);
    await updateSettings({ profilePicture: null });
  };

  // LOGIKA POSUNU (DRAG & PAN)
  const handleStartDrag = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({ x: clientX - offset.x, y: clientY - offset.y });
  };

  const handleMoveDrag = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    setOffset({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    });
  };

  const handleStopDrag = () => {
    setIsDragging(false);
  };

  // DYNAMICKÝ OŘEZ POMOCÍ HTML5 CANVAS (Bake transformací do čistého Base64 stringu)
  const handleSaveCroppedPhoto = () => {
    if (!selectedImage) return;

    const img = new Image();
    img.src = selectedImage;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      // Cílová velikost čtvercového ořezu (ideální kompromis mezi kvalitou a velikostí v DB)
      const targetSize = 200;
      canvas.width = targetSize;
      canvas.height = targetSize;

      if (ctx) {
        ctx.clearRect(0, 0, targetSize, targetSize);
        
        // Přesuneme počátek do středu plátna pro korektní rotace/škálování z bodu nula
        ctx.translate(targetSize / 2, targetSize / 2);
        
        // Přepočet měřítka z rozměru masky (220px) na finální plátno (200px)
        const maskToTargetRatio = targetSize / 220;
        ctx.scale(zoom * maskToTargetRatio, zoom * maskToTargetRatio);
        ctx.translate(offset.x, offset.y);

        // Zrcadlení chování CSS "object-fit: cover" pro zachování proporcí stran
        const imgRatio = img.width / img.height;
        let dWidth = 220;
        let dHeight = 220;

        if (imgRatio > 1) {
          dWidth = 220 * imgRatio;
        } else {
          dHeight = 220 / imgRatio;
        }

        ctx.drawImage(img, -dWidth / 2, -dHeight / 2, dWidth, dHeight);

        // Export do komprimovaného formátu JPEG (úspora místa)
        const croppedBase64 = canvas.toDataURL("image/jpeg", 0.85);
        
        updateSettings({ profilePicture: croppedBase64 });
        setIsCropOpen(false);
        setSelectedImage(null);
      }
    };
  };

  return (
    <div className="profile-page">
      <header>
        <div className="avatar-wrapper" onClick={handleAvatarClick}>
          <img src={avatarUrl} alt="Avatar" className="avatar" />
          <div className="avatar-overlay">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
          </div>
        </div>

        <input 
          type="file" 
          accept="image/png, image/jpeg, image/webp" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileChange} 
        />

        <h2>{user.fullName || user.username}</h2>
        <p className="email">@{user.username}</p>
      </header>
      
      <main>
        <UserStats />
        <Achievements />
        <ProfileCountries />
      </main>
      
      <BottomMenu />

      {/* MODÁLNÍ MENU: Volby obrázku */}
      {isMenuOpen && (
        <div className="instagram-modal-overlay" onClick={() => setIsMenuOpen(false)}>
          <div className="instagram-menu-content" onClick={(e) => e.stopPropagation()}>
            <div className="menu-header">
              <h3>{t('profile.change_title')}</h3>
            </div>
            <button className="menu-action blue" onClick={triggerFileInput}>{t('profile.upload_new')}</button>
            
            {settings?.profilePicture && (
              <button className="menu-action red" onClick={handleRemovePhoto}>{t('profile.remove_current')}</button>
            )}
            
            <button className="menu-action cancel" onClick={() => setIsMenuOpen(false)}>{t('profile.cancel')}</button>
          </div>
        </div>
      )}

      {/* MODÁLNÍ EDITOR: Posun a Měřítko (Pan & Zoom) */}
      {isCropOpen && (
        <div className="instagram-modal-overlay">
          <div className="instagram-crop-content">
            <h3>{t('profile.edit_title')}</h3>
            
            {/* Interaktivní zóna pro posouvání obrázku */}
            <div 
              className="crop-preview-container"
              onMouseDown={(e) => handleStartDrag(e.clientX, e.clientY)}
              onMouseMove={(e) => handleMoveDrag(e.clientX, e.clientY)}
              onMouseUp={handleStopDrag}
              onMouseLeave={handleStopDrag}
              onTouchStart={(e) => handleStartDrag(e.touches[0].clientX, e.touches[0].clientY)}
              onTouchMove={(e) => handleMoveDrag(e.touches[0].clientX, e.touches[0].clientY)}
              onTouchEnd={handleStopDrag}
            >
              <div className="circular-mask">
                {selectedImage && (
                  <img 
                    src={selectedImage} 
                    alt="Editor" 
                    style={{ 
                      transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                      cursor: isDragging ? 'grabbing' : 'grab'
                    }} 
                    className="image-to-crop"
                    draggable={false} // Vypnutí nativního HTML5 drag-and-dropu obrázků
                  />
                )}
              </div>
            </div>

            {/* Slider pro změnu přiblížení */}
            <div className="zoom-slider-wrapper">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input 
                type="range" 
                min="1" 
                max="3" 
                step="0.01" 
                value={zoom} 
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="zoom-slider"
              />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
            </div>
            
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => { setIsCropOpen(false); setSelectedImage(null); }}>{t('profile.back')}</button>
              <button className="btn-primary" onClick={handleSaveCroppedPhoto}>{t('profile.save')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;