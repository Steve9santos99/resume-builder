'use client';

import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { DadosCurriculo } from '@/types';

// Usando Helvetica (fonte padrão do PDF) para evitar erros de carregamento

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  leftColumn: {
    width: '30%',
    height: '100%',
    color: 'white',
    padding: 20,
  },
  rightColumn: {
    width: '70%',
    height: '100%',
    padding: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 20,
    alignSelf: 'center',
    objectFit: 'cover',
  },
  name: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    marginBottom: 5, 
    textTransform: 'uppercase' 
  },
  role: { 
    fontSize: 12, 
    color: '#7f8c8d', 
    marginBottom: 20, 
    letterSpacing: 1.5,
    textTransform: 'uppercase'
  },
  sectionTitleRight: { 
    fontSize: 13, 
    fontWeight: 'bold', 
    color: '#2c3e50', 
    marginBottom: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee', 
    paddingBottom: 5, 
    textTransform: 'uppercase' 
  },
  sectionTitleLeft: { 
    fontSize: 11, 
    fontWeight: 'bold', 
    color: '#ecf0f1', 
    marginBottom: 10, 
    marginTop: 20, 
    textTransform: 'uppercase', 
    borderBottomWidth: 1, 
    borderBottomColor: 'rgba(255,255,255,0.2)',
    paddingBottom: 5 
  },
  textRight: { 
    fontSize: 10, 
    lineHeight: 1.6,
    color: '#333', 
    marginBottom: 6, 
    textAlign: 'justify' 
  },
  textLeft: { 
    fontSize: 9, 
    lineHeight: 1.6, 
    color: '#ecf0f1', 
    marginBottom: 4 
  },
  expBlock: { marginBottom: 12 },
  expTitle: { fontSize: 11, fontWeight: 'bold', color: '#333' },
  expDate: { fontSize: 9, color: '#7f8c8d', marginBottom: 4 },
});

export const CurriculoPDF = ({ dados }: { dados: DadosCurriculo }) => {
  const cor = dados.corPrincipal || '#2c3e50';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* COLUNA ESQUERDA */}
        <View style={[styles.leftColumn, { backgroundColor: cor }]}>
          
          {dados.fotoUrl && (
            <Image src={dados.fotoUrl} style={styles.avatar} />
          )}

          <Text style={styles.sectionTitleLeft}>Contato</Text>
          {dados.email && <Text style={styles.textLeft}>{dados.email}</Text>}
          {dados.telefone && <Text style={styles.textLeft}>{dados.telefone}</Text>}
          {dados.linkedin && <Text style={styles.textLeft}>{dados.linkedin}</Text>}

          <Text style={styles.sectionTitleLeft}>Habilidades</Text>
          {(dados.habilidades || "").split(',').map((hab, i) => (
            hab.trim() && <Text key={i} style={styles.textLeft}>• {hab.trim()}</Text>
          ))}

          <Text style={styles.sectionTitleLeft}>Formação</Text>
          {dados.formacao.map(item => (
            <View key={item.id} style={{ marginBottom: 8 }}>
              <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 9 }}>{item.curso}</Text>
              <Text style={styles.textLeft}>{item.instituicao}</Text>
              <Text style={styles.textLeft}>{item.ano}</Text>
            </View>
          ))}
        </View>

        {/* COLUNA DIREITA */}
        <View style={styles.rightColumn}>
          
          <View style={{ marginBottom: 20 }}>
            <Text style={[styles.name, { color: cor }]}>{dados.nome || "SEU NOME"}</Text>
            <Text style={styles.role}>{dados.cargo || "CARGO DESEJADO"}</Text>
            {dados.resumo && <Text style={styles.textRight}>{dados.resumo}</Text>}
          </View>

          <View>
            <Text style={styles.sectionTitleRight}>Experiência Profissional</Text>
            {dados.experiencias.map((exp) => (
              <View key={exp.id} style={styles.expBlock}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                  <Text style={[styles.expTitle, { color: cor }]}>{exp.empresa || "Empresa"}</Text>
                  <Text style={styles.expDate}>{exp.periodo}</Text>
                </View>
                {exp.cargo && <Text style={{ fontSize: 10, fontWeight: 'bold', marginBottom: 2 }}>{exp.cargo}</Text>}
                {exp.descricao && <Text style={styles.textRight}>{exp.descricao}</Text>}
              </View>
            ))}
            {dados.experiencias.length === 0 && (
              <Text style={{ fontSize: 10, color: '#999' }}>
                Nenhuma experiência adicionada.
              </Text>
            )}
          </View>

        </View>

      </Page>
    </Document>
  );
};
