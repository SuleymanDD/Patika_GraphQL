import React, { useEffect, useState } from 'react'
import { GET_CHARACTERS, GET_FILTERS_COUNTS, GET_LOCATIONS, GET_CHARACTERS_WITH_IDS } from './queries'
import { useLazyQuery, useQuery } from '@apollo/client/react'
import styles from './styles.module.css'
import background from '../../assets/background.jpg'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { Row, Col, Card, Space, Typography, Select, Input, Pagination, Modal, Radio } from 'antd';
const { Title, Text } = Typography;

function Home() {
  const [pageSize, setPageSize] = useState(16);
  const [currentPage, setCurrentPage] = useState(1);
  const [allCharacters, setAllCharacters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [totalCharacters, setTotalCharacters] = useState(0);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [debouncedLocationSearchTerm, setDebouncedLocationSearchTerm] = useState("");
  const [searchedLocations, setSearchedLocations] = useState([]);

  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [getCharacters, { data, loading, error }] = useLazyQuery(GET_CHARACTERS);
  const [getLocations, { data: locationsData, loading: locationsLoading, error: locationsError }] = useLazyQuery(GET_LOCATIONS);
  const [getCharactersWithIds, { data: byIdsCharactersData }] = useLazyQuery(GET_CHARACTERS_WITH_IDS)
  const { data: filtersCountsData } = useQuery(GET_FILTERS_COUNTS);

  let displayedCharacters, startIndexInSearchResults;

  async function getCharactersFunc(targetIds) {
    try {
      console.log("Giriş yapılıyor...");
      for (const id of targetIds) {
        const era = await getCharacters({ variables: { id, filter: { name: searchTerm, gender: selectedGender, species: selectedSpecies } } });
        if (id === 1) setTotalCharacters(era.data?.characters?.info?.count);
        setAllCharacters(prev => [...prev, ...era.data?.characters?.results || []]);
        console.log("ilk data:", era.data?.characters?.results)
      };
    } catch (error) {
      if (error.name === 'AbortError' || error.message.includes('aborted')) {
        return;
      }
      if (error.message.includes('Failed to fetch') || error.message.includes('Network Error')) {
        Modal.error({
          title: 'Bağlantı Hatası',
          content: 'Çok fazla istek atıldı veya internet bağlantınız kesildi. Sayfayı yenilemek ister misiniz?',
          okText: 'Sayfayı Yenile',
          onOk() {
            window.location.reload();
          }
        });
        return;
      }
      console.error("Gerçek bir hata var:", error);
    }
  }
  async function getLocationsFunc() {
    try {
      if (debouncedLocationSearchTerm !== "") {
        const era = await getLocations({ variables: { locationName: debouncedLocationSearchTerm } });
        setSearchedLocations((era.data?.locations?.results).filter((e) => e.residents.length > 0) || []);
      }
    } catch (error) {
      if (error.name === 'AbortError' || error.message.includes('aborted')) {
        return;
      }
      if (error.message.includes('Failed to fetch') || error.message.includes('Network Error')) {
        Modal.error({
          title: 'Bağlantı Hatası',
          content: 'Çok fazla istek atıldı veya internet bağlantınız kesildi. Sayfayı yenilemek ister misiniz?',
          okText: 'Sayfayı Yenile',
          onOk() {
            window.location.reload();
          }
        });
        return;
      }
      console.error("Gerçek bir hata var:", error);
    }
  }
  async function getCharactersWithIdsFunc() {
    try {
      if (selectedLocation.length>0) {
        const era = await getLocations({ variables: { locationName: selectedLocation } });
        const charactersIds = (era.data?.locations?.results?.[0]?.residents).map((e) => e.id);
        const realEra = await getCharactersWithIds({ variables: { ids: charactersIds } });
        setTotalCharacters(charactersIds.length);
        setAllCharacters(realEra.data?.charactersByIds)
      }
    } catch (error) {
      if (error.name === 'AbortError' || error.message.includes('aborted')) {
        return;
      }
      if (error.message.includes('Failed to fetch') || error.message.includes('Network Error')) {
        Modal.error({
          title: 'Bağlantı Hatası',
          content: 'Çok fazla istek atıldı veya internet bağlantınız kesildi. Sayfayı yenilemek ister misiniz?',
          okText: 'Sayfayı Yenile',
          onOk() {
            window.location.reload();
          }
        });
        return;
      }
      console.error("Gerçek bir hata var:", error);
    }
  }

  const handleRadioChange = (e) => {
    const value = e.target.value;
    setSelectedGender(value);
  };
  const handleSpeciesChange = (e) => {
    const value = e.target.value;
    setSelectedSpecies(value);
  };
  const handleLocationChange = (e) => {
    const value = e.target.value;
    setSelectedLocation(value);
  };

  useEffect(() => {
    setCurrentPage(1); // Sayfa boyutu değiştiğinde sayfayı 1'e sıfırla
  }, [pageSize, debouncedSearchTerm, selectedGender, selectedSpecies, selectedLocation]);

  useEffect(() => {
    if (!selectedLocation) {
      setAllCharacters([]); // Sayfa değiştiğinde karakter listesini sıfırla
      const firstWantedCharacterIndex = (currentPage - 1) * pageSize;
      const lastWantedCharacters = currentPage * pageSize;

      let fwcBackendPage = Math.ceil(firstWantedCharacterIndex / 20);
      let lwcBackendPage = Math.ceil(lastWantedCharacters / 20);

      if (firstWantedCharacterIndex % 20 === 0) fwcBackendPage++;

      let targetIds = [];

      for (let i = fwcBackendPage; i <= lwcBackendPage; i++) {
        if (fwcBackendPage === 0) {
          fwcBackendPage = 1;
          continue;
        }
        targetIds.push(fwcBackendPage);
        fwcBackendPage++;
      }
      getCharactersFunc(targetIds);
    }
  }, [debouncedSearchTerm, currentPage, selectedGender, selectedSpecies]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setDebouncedLocationSearchTerm(locationSearchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, locationSearchTerm]);

  useEffect(() => {
    let timer;

    if (allCharacters.length === 0 && !loading) {
      timer = setTimeout(() => {
        setShowEmptyState(true);
      }, 50); // 50ms gecikme, hızlı geçişlerde boş durumun görünmesini engeller
    } else {
      setShowEmptyState(false);
    }

    return () => clearTimeout(timer);
  }, [allCharacters.length, loading]);

  useEffect(() => {
    getLocationsFunc();
  }, [debouncedLocationSearchTerm]);

  useEffect(() => {
    getCharactersWithIdsFunc();
  }, [selectedLocation]);

  if (currentPage === 1) {
    startIndexInSearchResults = 0;
  } else {
    startIndexInSearchResults = ((currentPage - 1) * Number(pageSize)) % 20;
  }
  if (!selectedLocation) {
    displayedCharacters = allCharacters.slice(startIndexInSearchResults, startIndexInSearchResults + Number(pageSize));
  } else {
    displayedCharacters = allCharacters.slice(pageSize * (currentPage - 1), pageSize * currentPage)
    console.log("displayeed: ", displayedCharacters)
  }


  //if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <header
        className={styles.heroSection}
        style={{ backgroundImage: `url(${background})` }} // Dinamik arka plan tanımı
      >
        {/* Arka plandaki resmi karartmak için overlay katmanı */}
        <div className={styles.heroOverlay}></div>

        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Wubba Lubba Dub Dub.</h1>

          <div className={styles.searchContainer}>
            {/* Büyüteç ikonu */}
            <SearchOutlined className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Name, description, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className={styles.dashboardContainer}>

        {/* ÜST BAR: Filtreler Başlığı ve Sayfalama Sayısı */}
        <Row justify="space-between" align="middle" className={styles.topBar}>
          <Col>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              height: '100%'
            }}>
              {/* Filters Başlığı */}
              <span style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#000000',
                lineHeight: 1,
                display: 'inline-block'
              }}>
                Filters
              </span>

              {/* Clear Filters Butonu */}
              <span
                onClick={() => {
                  setSelectedGender('');
                  setSelectedSpecies('');
                  setSelectedLocation('');
                }}
                className={styles.clearFiltersBtn}
                style={{
                  fontSize: '12px',
                  padding: '0px 8px',
                  color: '#8c8c8c',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  lineHeight: 1,
                  marginTop: '4px' // Eğer buton başlığa göre çok az yukarıda kalırsa bunu 2px veya 4px yap, aşağı kayar
                }}
              >
                <ReloadOutlined spin={false} style={{ marginRight: 4, fontSize: '12px' }} />
                Clear filters
              </span>
            </div>
          </Col>
          <Col>
            <Select
              defaultValue={`${pageSize} hits per page`}
              variant="borderless"
              style={{ width: 140 }}
              options={[{ value: '16', label: '16 hits per page' }, { value: '32', label: '32 hits per page' }, { value: '64', label: '64 hits per page' }]}
              onChange={(value) => setPageSize(value)}
            />
          </Col>
        </Row>

        <Row gutter={[32, 32]}>
          {/* SOL PANEL: Filtre Seçenekleri */}
          <Col xs={24} md={6} lg={5}>
            <div className={styles.filterSidebar}>

              {/* Cinsiyet Filtresi */}
              <div className={styles.filterGroup}>
                <span className={styles.filterGroupTitle}>GENDER</span>
                <Radio.Group value={selectedGender} onChange={handleRadioChange} style={{ width: '100%' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Radio value="Male">
                      <span className={styles.filterLabel}>Male</span> <span className={styles.filterCount}>{filtersCountsData?.maleCount?.info?.count || 0}</span>
                    </Radio>
                    <Radio value="Female">
                      <span className={styles.filterLabel}>Female</span> <span className={styles.filterCount}>{filtersCountsData?.femaleCount?.info?.count || 0}</span>
                    </Radio>
                    <Radio value="unknown">
                      <span className={styles.filterLabel}>unknown</span> <span className={styles.filterCount}>{filtersCountsData?.unknownGenderCount?.info?.count || 0}</span>
                    </Radio>
                    <Radio value="Genderless">
                      <span className={styles.filterLabel}>Genderless</span> <span className={styles.filterCount}>{filtersCountsData?.genderlessCount?.info?.count || 0}</span>
                    </Radio>
                  </Space>
                </Radio.Group>
              </div>


              <hr className={styles.filterDivider} />

              {/* Tür Filtresi */}
              <div className={styles.filterGroup}>
                <span className={styles.filterGroupTitle}>SPECIES</span>
                <Radio.Group value={selectedSpecies} onChange={handleSpeciesChange} style={{ width: '100%' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Radio value="Human">
                      <span className={styles.filterLabel}>Human</span> <span className={styles.filterCount}>{filtersCountsData?.humanCount?.info?.count || 0}</span>
                    </Radio>
                    <Radio value="Alien">
                      <span className={styles.filterLabel}>Alien</span> <span className={styles.filterCount}>{filtersCountsData?.alienCount?.info?.count || 0}</span>
                    </Radio>
                    <Radio value="Humanoid">
                      <span className={styles.filterLabel}>Humanoid</span> <span className={styles.filterCount}>{filtersCountsData?.humanoidCount?.info?.count || 0}</span>
                    </Radio>
                    <Radio value="Animal">
                      <span className={styles.filterLabel}>Animal</span> <span className={styles.filterCount}>{filtersCountsData?.animalCount?.info?.count || 0}</span>
                    </Radio>
                    <Radio value="Robot">
                      <span className={styles.filterLabel}>Robot</span> <span className={styles.filterCount}>{filtersCountsData?.robotCount?.info?.count || 0}</span>
                    </Radio>
                    <Radio value="Cronenberg">
                      <span className={styles.filterLabel}>Cronenberg</span> <span className={styles.filterCount}>{filtersCountsData?.cronenbergCount?.info?.count || 0}</span>
                    </Radio>
                    <Radio value="Mytholog">
                      <span className={styles.filterLabel}>Mytholog</span> <span className={styles.filterCount}>{filtersCountsData?.mythologCount?.info?.count || 0}</span>
                    </Radio>
                    <Radio value="Disease">
                      <span className={styles.filterLabel}>Disease</span> <span className={styles.filterCount}>{filtersCountsData?.diseaseCount?.info?.count || 0}</span>
                    </Radio>
                    <Radio value="Poopybutthole">
                      <span className={styles.filterLabel}>Poopybutthole</span> <span className={styles.filterCount}>{filtersCountsData?.poopybuttholeCount?.info?.count || 0}</span>
                    </Radio>
                    <Radio value="unknown">
                      <span className={styles.filterLabel}>unknown</span> <span className={styles.filterCount}>{filtersCountsData?.unknownSpeciesCount?.info?.count || 0}</span>
                    </Radio>
                  </Space>
                </Radio.Group>
              </div>


              <div className={styles.filterGroup}>
                <span className={styles.filterGroupTitle}>LOCATION</span>

                {/* Lokasyon içi arama çubuğu */}
                <Input
                  placeholder="Search for locations..."
                  prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                  className={styles.locationSearchInput}
                  variant="filled" // Ant Design v5 için hafif gri arka planlı modern input
                  value={locationSearchTerm}
                  onChange={(e) => setLocationSearchTerm(e.target.value)}
                />

                {/* Lokasyon Seçenekleri */}
                <Radio.Group value={selectedLocation} onChange={handleLocationChange} style={{ width: '100%' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {debouncedLocationSearchTerm.length === 0 ? (
                      <>
                        <Radio value="Earth (Replacement Dimension)">
                          <span className={styles.filterLabel}>Earth (Replacement Dimension)</span>
                          <span className={styles.filterCount}>{filtersCountsData?.earthReplacementDimensionCount?.results?.[0]?.residents?.length || 0}</span>
                        </Radio>
                        <Radio value="Citadel of Ricks">
                          <span className={styles.filterLabel}>Citadel of Ricks</span>
                          <span className={styles.filterCount}>{filtersCountsData?.citadelofRicksCount?.results?.[0]?.residents?.length || 0}</span>
                        </Radio>
                        <Radio value="Interdimensional Cable">
                          <span className={styles.filterLabel}>Interdimensional Cable</span>
                          <span className={styles.filterCount}>{filtersCountsData?.interdimensionalCableCount?.results?.[0]?.residents?.length || 0}</span>
                        </Radio>
                        <Radio value="Earth (C-137)">
                          <span className={styles.filterLabel}>Earth (C-137)</span>
                          <span className={styles.filterCount}>{filtersCountsData?.earthC137Count?.results?.[0]?.residents?.length || 0}</span>
                        </Radio>
                        <Radio value="Worldender's lair">
                          <span className={styles.filterLabel}>Worldender's lair</span>
                          <span className={styles.filterCount}>{filtersCountsData?.worldenderslairCount?.results?.[0]?.residents?.length || 0}</span>
                        </Radio>
                      </>
                    ) :
                      searchedLocations.length === 0 ? (
                        <span style={{ color: '#8c8c8c', fontSize: '14px', paddingLeft: '8px' }}>
                          No Results
                        </span>
                      ) : (
                        searchedLocations.map((locs) => (
                          <Radio key={locs.id || locs.name} value={locs.name}>
                            <span className={styles.filterLabel}>{locs.name}</span>
                            <span className={styles.filterCount}>{locs.residents?.length || 0}</span>
                          </Radio>
                        ))
                      )}
                  </Space>
                </Radio.Group>
              </div>
            </div>
          </Col>

          {showEmptyState &&
            <div className={styles.emptyContainer}>
              {/* Arka plandaki iç içe halkalar ve büyüteç ikonu */}
              <div className={styles.iconCircleOuter}>
                <div className={styles.iconCircleInner}>
                  <SearchOutlined className={styles.magnifierIcon} />
                </div>
              </div>

              {/* Başlık ve Alt Bilgi Metni */}
              <h2 className={styles.mainTitle}>
                Sorry, we can't find any matches to your query!
              </h2>
              <p className={styles.subTitle}>
                Please try another query.
              </p>
            </div>}
          {!showEmptyState &&
            <Col xs={24} md={18} lg={19}>
              <Row gutter={[24, 24]}>
                {displayedCharacters.map((character) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={character.id}>
                    <Card
                      hoverable
                      bordered={false}
                      className={styles.characterCard}
                      cover={
                        <img
                          alt={character.name || "Unknown Character"}
                          src={character.image}
                          className={styles.cardImage}
                        />
                      }
                    >
                      <div className={styles.cardBody}>
                        <span className={styles.charType}>{character.type || "Unknown"}</span>
                        <h4 className={styles.charName}>{character.name || "Unknown"}</h4>
                        <span className={styles.charLocation}>{character.location.name || "Unknown"}</span>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>}
        </Row>
        {!showEmptyState &&
          <div className={styles.paginationContainer}>
            <Pagination
              current={currentPage}
              pageSize={Number(pageSize)} // Sayfa başına gösterilecek kart
              total={totalCharacters} //data?.characters?.info?.count || 0
              showSizeChanger={false} // Sağdaki sayfa boyutu seçiciyi gizler
              onChange={(page) => setCurrentPage(page)}
            />
          </div>}

      </div>
    </div>
  )
}

export default Home