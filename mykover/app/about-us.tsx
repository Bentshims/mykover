import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function AboutUsScreen() {
  const features = [
    {
      title: 'Couverture Santé',
      description: 'Plans adaptés à vos besoins avec un large réseau de soins',
      icon: 'shield-heart',
    },
    {
      title: 'Paiement Mobile',
      description: 'Payez facilement avec Mobile Money et cartes bancaires',
      icon: 'mobile-screen',
    },
    {
      title: 'Réclamations Rapides',
      description: 'Soumettez et suivez vos remboursements en ligne',
      icon: 'file-invoice',
    },
    {
      title: 'Support 24/7',
      description: 'Assistance continue pour vos questions santé',
      icon: 'headset',
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 16, 
        borderBottomWidth: 1, 
        borderBottomColor: '#e5e5e5' 
      }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <FontAwesome6 name="arrow-left" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>À propos</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {/* Hero Section */}
        <View style={{ 
          backgroundColor: '#f8f9fa', 
          borderRadius: 12, 
          padding: 20, 
          marginBottom: 24,
          alignItems: 'center'
        }}>
          <View style={{ 
            width: 80, 
            height: 80, 
            backgroundColor: '#000', 
            borderRadius: 40, 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: 12
          }}>
            <FontAwesome6 name="shield-heart" size={32} color="#fff" />
          </View>
          <Text style={{ 
            fontSize: 24, 
            fontWeight: 'bold', 
            textAlign: 'center',
            marginBottom: 8
          }}>
            MyKover
          </Text>
          <Text style={{ 
            fontSize: 16, 
            color: '#666', 
            textAlign: 'center',
            lineHeight: 22
          }}>
            Votre partenaire santé numérique en RDC
          </Text>
        </View>

        {/* Mission */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ 
            fontSize: 20, 
            fontWeight: 'bold', 
            marginBottom: 12 
          }}>
            Notre Mission
          </Text>
          <Text style={{ 
            fontSize: 16, 
            color: '#333', 
            lineHeight: 24 
          }}>
            Simplifier l'accès aux soins de santé grâce à une assurance digitale 
            accessible, transparente et adaptée aux besoins des Congolais.
          </Text>
        </View>

        {/* Features */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ 
            fontSize: 20, 
            fontWeight: 'bold', 
            marginBottom: 16 
          }}>
            Ce que nous offrons
          </Text>
          <View style={{ gap: 12 }}>
            {features.map((feature, index) => (
              <View key={index} style={{ 
                flexDirection: 'row', 
                alignItems: 'flex-start',
                backgroundColor: '#f8f9fa',
                padding: 16,
                borderRadius: 8
              }}>
                <View style={{ 
                  width: 40, 
                  height: 40, 
                  backgroundColor: '#000', 
                  borderRadius: 20, 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginRight: 12
                }}>
                  <FontAwesome6 name={feature.icon} size={18} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ 
                    fontSize: 16, 
                    fontWeight: '600', 
                    marginBottom: 4 
                  }}>
                    {feature.title}
                  </Text>
                  <Text style={{ 
                    fontSize: 14, 
                    color: '#666', 
                    lineHeight: 20 
                  }}>
                    {feature.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Contact */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ 
            fontSize: 20, 
            fontWeight: 'bold', 
            marginBottom: 16 
          }}>
            Contact
          </Text>
          <View style={{ gap: 12 }}>
            <TouchableOpacity 
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center',
                padding: 16,
                backgroundColor: '#f8f9fa',
                borderRadius: 8
              }}
              onPress={() => Linking.openURL('mailto:support@mykover.cd')}
            >
              <FontAwesome6 name="envelope" size={20} color="#000" style={{ marginRight: 12 }} />
              <Text style={{ fontSize: 16, color: '#333' }}>support@mykover.cd</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center',
                padding: 16,
                backgroundColor: '#f8f9fa',
                borderRadius: 8
              }}
              onPress={() => Linking.openURL('tel:+243970000000')}
            >
              <FontAwesome6 name="phone" size={20} color="#000" style={{ marginRight: 12 }} />
              <Text style={{ fontSize: 16, color: '#333' }}>+243 970 000 000</Text>
            </TouchableOpacity>
            
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              padding: 16,
              backgroundColor: '#f8f9fa',
              borderRadius: 8
            }}>
              <FontAwesome6 name="location-dot" size={20} color="#000" style={{ marginRight: 12 }} />
              <Text style={{ fontSize: 16, color: '#333' }}>Kinshasa, RDC</Text>
            </View>
          </View>
        </View>

        {/* Simple Footer */}
        <View style={{ 
          paddingTop: 20, 
          borderTopWidth: 1, 
          borderTopColor: '#e5e5e5',
          alignItems: 'center'
        }}>
          <Text style={{ 
            fontSize: 14, 
            color: '#666', 
            textAlign: 'center',
            marginBottom: 8
          }}>
            MyKover © 2025
          </Text>
          <Text style={{ 
            fontSize: 12, 
            color: '#999', 
            textAlign: 'center'
          }}>
            Assurance santé numérique pour tous
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}