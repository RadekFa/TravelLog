package cz.upa.travellogbackend.repository;

import cz.upa.travellogbackend.model.UserSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/*
repozitář pro správu uživatelských nastavení
zajišťuje persistenci preferencí jako jazyk nebo tmavý režim
poskytuje metodu pro bezpečné získání nastavení podle id uživatele
*/
public interface UserSettingRepository extends JpaRepository<UserSetting, Long> {
    Optional<UserSetting> findByUserId(Long userId);
}