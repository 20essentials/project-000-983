import { useEffect, useRef } from 'react';
import '@/styles/Game.css';

export function Game() {
  const holesRef = useRef<HTMLDivElement[]>([]);
  const molesRef = useRef<HTMLDivElement[]>([]);
  const scoreBoardRef = useRef<HTMLSpanElement>(null!);
  const lastHoleRef = useRef<HTMLDivElement | null>(null);
  const timeUpRef = useRef<boolean>(false);
  const scoreRef = useRef<number>(0);

  function randomTime(min: number, max: number): number {
    return Math.round(Math.random() * (max - min) + min);
  }

  function randomHole(holes: HTMLDivElement[]): HTMLDivElement {
    let hole: HTMLDivElement;
    do {
      const idx = Math.floor(Math.random() * holes.length);
      hole = holes[idx];
    } while (hole === lastHoleRef.current);
    lastHoleRef.current = hole;
    return hole;
  }

  function peep(): void {
    const time = randomTime(200, 1000);
    const hole = randomHole(holesRef.current);
    hole.classList.add('up');
    setTimeout(() => {
      hole.classList.remove('up');
      if (!timeUpRef.current) peep();
    }, time);
  }

  function startGame(): void {
    scoreRef.current = 0;
    scoreBoardRef.current.textContent = '0';
    timeUpRef.current = false;
    peep();
    setTimeout(() => {
      timeUpRef.current = true;
    }, 10000);
  }

  useEffect(() => {
    const moles = [...molesRef.current];

    function bonk(e: MouseEvent): void {
      if (!e.isTrusted) return;
      const target = e.target as HTMLElement;
      target.parentElement?.classList.remove('up');
      scoreRef.current++;
      if (scoreBoardRef.current) {
        scoreBoardRef.current.textContent = scoreRef.current.toString();
      }
    }

    moles.forEach(mole => {
      mole?.addEventListener('click', bonk);
    });

    return () => {
      moles.forEach(mole => {
        mole?.removeEventListener('click', bonk);
      });
    };
  }, []);

  return (
    <>
      <header className='am-header'>
        <h1>Topea al Topo</h1>

        <aside className='btn'>
          <span className='score' ref={scoreBoardRef}>
            0
          </span>
          <button onClick={startGame}>Start!</button>
        </aside>
      </header>

      <div className='game'>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`hole hole${i + 1}`}
            ref={el => {
              if (el) holesRef.current[i] = el;
            }}
          >
            <div
              className='mole'
              ref={el => {
                if (el) molesRef.current[i] = el;
              }}
            ></div>
          </div>
        ))}
      </div>
    </>
  );
}
