import { useEffect, useState } from 'react';
import * as C from "./App.styles";
import logoImage from './assets/devmemory_logo.png';
import { InfoItem } from "./components/InfoItem";
import { Button } from "./components/Button";
import restartIcon from './svgs/restart.svg';
import { GridItemType } from './types/GridItemType';
import { items } from './data/items';
import { GridItem } from './components/GridItem';
import { formatTimeElapsed } from './helpers/formatTimeElapsed';

function App() {  
  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [showCount, setShowCount] = useState<number>(0);
  const [gridItens, setGridItens] = useState<GridItemType[]>([]);

  useEffect(() => {
    resetAndCreateGrid();
  },[]);

  //Criando e fazendo o timer funcionar
  useEffect(() => {
    const timer = setInterval(()=> {
      if(playing === true) {
        setTimeElapsed(timeElapsed+1);
      }
    }, 1000);
    return () => clearInterval(timer);
  },[playing, timeElapsed]);

  //Verifica se as peças abertas no jogo são iguais.
  useEffect(() => {
    if(showCount === 2){
      let opened = gridItens.filter(item => item.shown === true);
      if(opened.length === 2){
          
          if(opened[0].item === opened[1].item){
            //Se eles são iguais torná-los permanentes
            let tempGrid = [...gridItens];
            for(let i in tempGrid){
                if(tempGrid[i].shown){
                  tempGrid[i].permanentShown = true;
                  tempGrid[i].shown = false;
                }
            }
            setGridItens(tempGrid);
            setShowCount(0);

          } else {
            //Se não são iguais, fecha eles.
            setTimeout(() => {
              let tempGrid = [...gridItens];
              for(let i in tempGrid) {
                  tempGrid[i].shown = false;
              }
              setGridItens(tempGrid);
              setShowCount(0);
            }, 1000/2)
          }
          

          setMoveCount(moveCount => moveCount +1);
      }
    }
  },[showCount, gridItens]);

  //Verifica se o jogo acabou 
  useEffect(() => {
    if(moveCount > 0 && gridItens.every(item => item.permanentShown === true)) {
      setPlaying(false);
    }
  }, [moveCount, gridItens]);
  
  
  const resetAndCreateGrid = () => {
    //Step 1: reertar o jogo
    setTimeElapsed(0)
    setMoveCount(0);
    setShowCount(0);

    //Step 2: criar o grid
    // 2.1 criar o grid vazio
    let tempGrid: GridItemType[] = [];
    for (let i = 0; i < (items.length * 2); i++) {
      tempGrid.push({
        item: null, shown: false, permanentShown: false
      });
    }

    //2.2 preencher o grid
    for(let w=0; w < 2; w++) {
      for (let i= 0; i < items.length; i++){
        let pos = -1;
        while(pos < 0 || tempGrid[pos].item !== null){
          pos = Math.floor(Math.random() * (items.length *2));
        }
        tempGrid[pos].item = i;
      }
    }

    //2.3 jogar no state 
    setGridItens(tempGrid);

    //Step 3: Começar o jogo
    setPlaying(true);

  }
  
  const handleItemClick = (index: number) => {
    if(playing ?? index !== null ?? showCount < 2) {
      let tempGrid = [...gridItens];
      if(tempGrid[index].permanentShown === false && tempGrid[index].shown === false) {
        tempGrid[index].shown = true;
        setShowCount(showCount + 1);
      }
      setGridItens(tempGrid);
    }

  }

  return (
    <C.Container>
      <C.Info>
          <C.LogoLink>
              <img src={logoImage} alt="logo" width="200" />
          </C.LogoLink>
          <C.InfoArea>
              <InfoItem label="Tempo" value={formatTimeElapsed(timeElapsed)} />
              <InfoItem label="Movimentos" value={moveCount.toString()} />
          </C.InfoArea>
          <Button label="Reiniciar" icon={restartIcon} onClick={resetAndCreateGrid} />
      </C.Info>
      <C.GridArea>
          <C.Grid>
            { gridItens.map((item, index)=>(
                <GridItem 
                  key={index}
                  item={item}
                  onClick={() => handleItemClick(index)}
                />
              ))}
          </C.Grid>
      </C.GridArea>
    </C.Container>
  );
}

export default App;
