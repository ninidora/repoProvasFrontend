import styled from 'styled-components';
import { useState, useEffect } from 'react';
import {
  GenericButtonStyled,
  CheckStuff,
  CheckIconStyled,
  LoginDataContainerStyled,
  BoxStyled,
} from '../shared/sharedStyles/sharedStyles';
import {
  getDisciplinas,
  getProfessoresDasDisciplinas,
  postProva,
} from '../service';
import CheckContainer from '../shared/sharedComponents/checkStuff';
import { useHistory } from 'react-router';

export default function NovaProvaPage() {
  const [prova, setProva] = useState({});
  const [disciplinasList, setDisciplinasList] = useState([]);
  const [professoresList, setProfessoresList] = useState([]);
  const [bodyProva, setBodyProva] = useState([]);
  const history = useHistory();

  useEffect(() => {
    getDisciplinas()
      .then((res) => {
        setDisciplinasList(res.data);
      })
      .catch((err) => {
        alert(err.response.data);
      });
  }, []);

  function enviarProva(event) {
    event.preventDefault();
    postProva(bodyProva)
      .then((res) => {
        alert('inseriu nova prova');
        history.push('/');
      })
      .catch((err) => {
        alert(err.response.data);
      });
  }

  function selectType(type) {
    if (prova.categoria !== '') {
      setProva({ ...prova, categoria: '' });
    }
    if (type === 'P1') {
      setProva({ ...prova, categoria: 1 });
      setBodyProva({ ...bodyProva, categoriasId: 1 });
    }
    if (type === 'P2') {
      setProva({ ...prova, categoria: 2 });
      setBodyProva({ ...bodyProva, categoriasId: 2 });
    }
    if (type === 'P3') {
      setProva({ ...prova, categoria: 3 });
      setBodyProva({ ...bodyProva, categoriasId: 3 });
    }
    if (type === '2ch') {
      setProva({ ...prova, categoria: 4 });
      setBodyProva({ ...bodyProva, categoriasId: 4 });
    }
    if (type === 'Outros') {
      setProva({ ...prova, categoria: 5 });
      setBodyProva({ ...bodyProva, categoriasId: 5 });
    }
  }
  function selectDisciplina(type) {
    if (prova.disciplina !== '') {
      setProva({ ...prova, disciplina: '' });
    }
    setProva({ ...prova, disciplina: type });
    let disciplinaEscolhida = disciplinasList.find(
      (disciplina) => disciplina.nomeDisciplina === type,
    );

    setBodyProva({ ...bodyProva, disciplinaId: disciplinaEscolhida.id });

    const body = {
      id: disciplinaEscolhida.id,
    };

    getProfessoresDasDisciplinas(body)
      .then((res) => {
        setProfessoresList(res.data);
      })
      .catch((err) => {
        alert(err.response.data);
      });
  }
  function selectProfessor(type) {
    if (prova.professor !== '') {
      setProva({ ...prova, professor: '' });
    }
    setProva({ ...prova, professor: type });

    let professorEscolhido = professoresList.find(
      (professor) => professor.professores.nomeProfessor === type,
    );

    setBodyProva({
      ...bodyProva,
      professorId: professorEscolhido.professores.id,
    });
  }

  return (
    <LoginDataContainerStyled onSubmit={enviarProva}>
      <h1>Inserir Prova</h1>
      <SignUpOrLoginInputStyled
        type="Nomeprova"
        placeholder="Titulo da prova"
        value={bodyProva.nomeProva}
        onChange={(e) =>
          setBodyProva({ ...bodyProva, nomeProva: e.target.value })
        }
        required
      />
      <BoxStyled>
        <summary>
          <p>Categoria</p>
          <p>👇🏽</p>
        </summary>
        <CheckStuff>
          <CheckIconStyled
            onClick={() => selectType('P1')}
            checked={() => (prova.categoria === 1 ? 'green' : '')}
          ></CheckIconStyled>
          <p>P1</p>
        </CheckStuff>
        <CheckStuff>
          <CheckIconStyled
            onClick={() => selectType('P2')}
            checked={() => (prova.categoria === 2 ? 'green' : '')}
          ></CheckIconStyled>
          <p>P2</p>
        </CheckStuff>
        <CheckStuff>
          <CheckIconStyled
            onClick={() => selectType('P3')}
            checked={() => (prova.categoria === 3 ? 'green' : '')}
          ></CheckIconStyled>
          <p>P3</p>
        </CheckStuff>
        <CheckStuff>
          <CheckIconStyled
            onClick={() => selectType('2ch')}
            checked={() => (prova.categoria === 4 ? 'green' : '')}
          ></CheckIconStyled>
          <p>2ch</p>
        </CheckStuff>
        <CheckStuff>
          <CheckIconStyled
            onClick={() => selectType('Outros')}
            checked={() => (prova.categoria === 5 ? 'green' : '')}
          ></CheckIconStyled>
          <p>Outros</p>
        </CheckStuff>
      </BoxStyled>
      <BoxStyled>
        <summary>
          <p>Disciplina</p>
          <p>👇🏽</p>
        </summary>
        {disciplinasList.map((disciplina) => {
          return (
            <CheckContainer
              nome={`${disciplina.nomeDisciplina}`}
              func={selectDisciplina}
              prova={prova}
              categoria={'disciplinas'}
            ></CheckContainer>
          );
        })}
      </BoxStyled>
      <BoxStyled>
        <summary>
          <p>Professor</p>
          <p>👇🏽</p>
        </summary>
        {professoresList.length !== 0
          ? professoresList.map((professorObjt) => {
              return (
                <CheckContainer
                  nome={professorObjt.professores.nomeProfessor}
                  func={selectProfessor}
                  prova={prova}
                  categoria={'professores'}
                ></CheckContainer>
              );
            })
          : ''}
      </BoxStyled>
      <SignUpOrLoginInputStyled
        type="linkProva"
        placeholder="Link da prova"
        value={bodyProva.linkProva}
        onChange={(e) =>
          setBodyProva({ ...bodyProva, linkProva: e.target.value })
        }
        required
      />
      <GenericButtonStyled type="submit">Enviar</GenericButtonStyled>
    </LoginDataContainerStyled>
  );
}

const SignUpOrLoginInputStyled = styled.input`
  width: 100%;
  height: 65px;
  margin-bottom: 13px;
  background-color: #fff;
  border-radius: 6px;
  border: none;
  padding-left: 17px;
  font-family: 'Oswald', sans-serif;
  font-size: 27px;
  font-weight: 700;

  &::placeholder {
    color: #9f9f9f;
  }
`;
