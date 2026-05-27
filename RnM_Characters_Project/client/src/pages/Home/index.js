import React, { use, useEffect, useState } from 'react'
import { GET_CHARACTERS } from './queries'
import { useLazyQuery, useQuery } from '@apollo/client/react'
import styles from './styles.module.css'
import background from '../../assets/background.jpg'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { Row, Col, Checkbox, Card, Space, Typography, Select, Input, Pagination, Modal, Button } from 'antd';
const { Title, Text } = Typography;

function Home() {
  const [pageSize, setPageSize] = useState(16);
  const [currentPage, setCurrentPage] = useState(1);
  const [backendPage, setBackendPage] = useState(1);
  const [allCharacters, setAllCharacters] = useState([]);

  const [getCharacters, { data, loading, error }] = useLazyQuery(GET_CHARACTERS);

  async function getCharactersFunc(targetIds) {
    try {
      for (const id of targetIds) {
        console.log("Fetching characters for backend page:", id);
        const era = await getCharacters({ variables: { id } });
        setAllCharacters(prev => [...prev, ...era.data?.characters?.results || []]);
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


  useEffect(() => {
    setAllCharacters([]); // Sayfa değiştiğinde karakter listesini sıfırla
    const firstWantedCharacterIndex = (currentPage - 1) * pageSize;
    const lastWantedCharacters = currentPage * pageSize;
    let fwcBackendPage = Math.ceil(firstWantedCharacterIndex / 20);
    let lwcBackendPage = Math.ceil(lastWantedCharacters / 20);

    if (lwcBackendPage > 42) lwcBackendPage = 42; // API'nin toplam 42 sayfası var, bu sınırı aşmamak için kontrol ekliyoruz

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
  }, [currentPage, pageSize]);

  const startIndex = (currentPage - 1) * Number(pageSize);
  const firstIndexInArray = () => {
    for (let i = 0; i < allCharacters.length; i++) {
      if (allCharacters[i].id === String(startIndex + 1)) {
        return i;
      }
    }
  }
  const endIndex = firstIndexInArray() + Number(pageSize);
  const displayedCharacters = allCharacters.slice(firstIndexInArray(), endIndex);
  console.log("Displayed characters:", displayedCharacters);

  if (loading) return <p>Loading...</p>;
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
            />
          </div>
        </div>
      </header>

      <div className={styles.dashboardContainer}>

        {/* ÜST BAR: Filtreler Başlığı ve Sayfalama Sayısı */}
        <Row justify="space-between" align="middle" className={styles.topBar}>
          <Col>
            <Space size="middle">
              <Title level={3} style={{ margin: 0, fontWeight: 700 }}>Filters</Title>
              <Text type="secondary" className={styles.clearFiltersBtn}>
                <ReloadOutlined spin={false} style={{ marginRight: 4 }} /> Clear filters
              </Text>
            </Space>
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
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Checkbox><span className={styles.filterLabel}>Male</span> <span className={styles.filterCount}>445</span></Checkbox>
                  <Checkbox><span className={styles.filterLabel}>Female</span> <span className={styles.filterCount}>91</span></Checkbox>
                  <Checkbox><span className={styles.filterLabel}>unknown</span> <span className={styles.filterCount}>44</span></Checkbox>
                  <Checkbox><span className={styles.filterLabel}>Genderless</span> <span className={styles.filterCount}>11</span></Checkbox>
                </Space>
              </div>

              <hr className={styles.filterDivider} />

              {/* Tür Filtresi */}
              <div className={styles.filterGroup}>
                <span className={styles.filterGroupTitle}>SPECIES</span>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Checkbox><span className={styles.filterLabel}>Human</span> <span className={styles.filterCount}>272</span></Checkbox>
                  <Checkbox><span className={styles.filterLabel}>Alien</span> <span className={styles.filterCount}>157</span></Checkbox>
                  <Checkbox><span className={styles.filterLabel}>Humanoid</span> <span className={styles.filterCount}>57</span></Checkbox>
                  <Checkbox><span className={styles.filterLabel}>Animal</span> <span className={styles.filterCount}>50</span></Checkbox>
                  <Checkbox><span className={styles.filterLabel}>Robot</span> <span className={styles.filterCount}>17</span></Checkbox>
                  <Checkbox><span className={styles.filterLabel}>Cronenberg</span> <span className={styles.filterCount}>8</span></Checkbox>
                </Space>
              </div>

              <div className={styles.filterGroup}>

                <span className={styles.filterGroupTitle}>LOCATION</span>

                {/* Lokasyon içi arama çubuğu */}
                <Input
                  placeholder="Search for locations..."
                  prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                  className={styles.locationSearchInput}
                  variant="filled" // Ant Design v5 için hafif gri arka planlı modern input
                />

                {/* Lokasyon Seçenekleri */}
                <Space direction="vertical" style={{ width: '100%', marginTop: '12px' }}>
                  <Checkbox>
                    <span className={styles.filterLabelWrap}>Earth (Replacement Dimension)</span>
                    <span className={styles.filterCount}>127</span>
                  </Checkbox>
                  <Checkbox><span className={styles.filterLabel}>Citadel of Ricks</span> <span className={styles.filterCount}>91</span></Checkbox>
                  <Checkbox><span className={styles.filterLabel}>Interdimensional Cable</span> <span className={styles.filterCount}>60</span></Checkbox>
                  <Checkbox><span className={styles.filterLabel}>Earth (C-137)</span> <span className={styles.filterCount}>27</span></Checkbox>
                  <Checkbox><span className={styles.filterLabel}>unknown</span> <span className={styles.filterCount}>22</span></Checkbox>
                  <Checkbox><span className={styles.filterLabel}>Snake Planet</span> <span className={styles.filterCount}>15</span></Checkbox>
                </Space>
              </div>

            </div>
          </Col>

          {/* SAĞ PANEL: Karakter Kart Gridi */}
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
          </Col>
        </Row>
        <div className={styles.paginationContainer}>
          <Pagination
            current={currentPage}
            pageSize={Number(pageSize)} // Sayfa başına gösterilecek kart
            total={826} //data?.characters?.info?.count || 0
            showSizeChanger={false} // Sağdaki sayfa boyutu seçiciyi gizler
            onChange={(page) => setCurrentPage(page)}
          />
        </div>

      </div>
    </div>
  )
}

export default Home