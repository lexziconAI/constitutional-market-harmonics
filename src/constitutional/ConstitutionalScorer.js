/**
 * Constitutional Scoring Engine
 * Evaluates companies against Yama principles using Axiom X memory and context
 */

const fs = require('fs');
const path = require('path');

class ConstitutionalScorer {
  constructor(axiomMemoryPath = '../../../') {
    this.axiomMemoryPath = axiomMemoryPath;
    this.yamaPrinciples = ['ahimsa', 'satya', 'asteya', 'brahmacharya', 'aparigraha'];
    this.companyDatabase = new Map();
    this.axiomContext = this.loadAxiomContext();
  }

  /**
   * Load Axiom X constitutional context and memory
   */
  loadAxiomContext() {
    try {
      // Load constitutional evolution markers
      const markers = [
        'AXIOM_X_CONSTITUTIONAL_EVOLUTION_MARKER.md',
        'axiom_x_constitutional_recon_report.json',
        'AXIOM_X_COMPLETE_STATE_DOCUMENTATION.md'
      ];

      const context = {
        constitutional_memory: {},
        evolution_markers: {},
        assessment_frameworks: {}
      };

      for (const marker of markers) {
        const markerPath = path.join(this.axiomMemoryPath, marker);
        if (fs.existsSync(markerPath)) {
          try {
            if (marker.endsWith('.json')) {
              context.evolution_markers[marker] = JSON.parse(fs.readFileSync(markerPath, 'utf8'));
            } else {
              context.evolution_markers[marker] = fs.readFileSync(markerPath, 'utf8');
            }
          } catch (e) {
            console.warn(`⚠️  Could not load Axiom marker ${marker}:`, e.message);
          }
        }
      }

      // Load constitutional contexts
      const contextsPath = path.join(this.axiomMemoryPath, '.ide', 'user_instructions', 'prompts', '.ide.user_instructions.yaml.instructions.md');
      if (fs.existsSync(contextsPath)) {
        context.constitutional_memory.instructions = fs.readFileSync(contextsPath, 'utf8');
      }

      console.log('🧠 Loaded Axiom X constitutional context');
      return context;

    } catch (error) {
      console.warn('⚠️  Could not load full Axiom context, using fallback mode:', error.message);
      return {
        constitutional_memory: {
          fallback: true,
          principles: this.yamaPrinciples
        }
      };
    }
  }

  /**
   * Score company against Yama principles
   */
  async scoreCompany(ticker, companyData = {}) {
    console.log(`🌟 Scoring ${ticker} constitutionally...`);

    try {
      const scores = {};

      // Evaluate each Yama principle
      scores.ahimsa = await this.evaluateAhimsa(ticker, companyData);
      scores.satya = await this.evaluateSatya(ticker, companyData);
      scores.asteya = await this.evaluateAsteya(ticker, companyData);
      scores.brahmacharya = await this.evaluateBrahmacharya(ticker, companyData);
      scores.aparigraha = await this.evaluateAparigraha(ticker, companyData);

      // Calculate weighted overall score
      const weights = {
        ahimsa: 0.25,      // Non-harm (most important)
        satya: 0.25,       // Truthfulness (most important)
        asteya: 0.20,      // Non-stealing
        brahmacharya: 0.15, // Self-discipline
        aparigraha: 0.15   // Non-hoarding
      };

      const overallScore = Object.entries(scores).reduce((sum, [principle, score]) => {
        return sum + (score * weights[principle]);
      }, 0);

      const result = {
        ticker,
        company_name: companyData.name || ticker,
        overall: Math.max(0, Math.min(1, overallScore)), // Clamp to [0,1]
        yamaScores: scores,
        ethicalAlignment: this.getEthicalAlignment(overallScore),
        breakdown: scores,
        timestamp: new Date(),
        sources: companyData.sources || ['Axiom X Constitutional Analysis'],
        assessment_method: 'Axiom X Yama Principle Evaluation',
        axiom_context_used: !this.axiomContext.constitutional_memory.fallback
      };

      console.log(`✅ ${ticker} constitutional score: ${(result.overall * 100).toFixed(1)}%`);
      return result;

    } catch (error) {
      console.error(`❌ Error scoring ${ticker}:`, error.message);

      // Return neutral score on error
      return {
        ticker,
        company_name: companyData.name || ticker,
        overall: 0.5, // Neutral
        yamaScores: {
          ahimsa: 0.5,
          satya: 0.5,
          asteya: 0.5,
          brahmacharya: 0.5,
          aparigraha: 0.5
        },
        ethicalAlignment: this.getEthicalAlignment(0.5),
        breakdown: {
          ahimsa: 0.5,
          satya: 0.5,
          asteya: 0.5,
          brahmacharya: 0.5,
          aparigraha: 0.5
        },
        timestamp: new Date(),
        sources: ['Error Fallback'],
        error: error.message
      };
    }
  }

  /**
   * Evaluate Ahimsa (Non-harm) principle
   */
  async evaluateAhimsa(ticker, data) {
    let score = 0.5; // Start neutral

    // Environmental impact assessment
    if (data.carbon_intensity !== undefined) {
      const industry_avg = this.getIndustryAverage('carbon_intensity', data.industry);
      if (data.carbon_intensity < industry_avg) score += 0.1;
      if (data.carbon_intensity < industry_avg * 0.8) score += 0.1;
    }

    if (data.renewable_energy_pct !== undefined) {
      if (data.renewable_energy_pct > 50) score += 0.1;
      if (data.renewable_energy_pct > 80) score += 0.1;
    }

    // Worker treatment
    if (data.safety_record === 'excellent') score += 0.1;
    if (data.labor_violations === 0) score += 0.1;

    // Product safety
    if (data.product_recalls === 0) score += 0.1;
    if (data.safety_ratings === 'A+') score += 0.1;

    // Community impact
    if (data.community_investment !== undefined) {
      if (data.community_investment > 1.0) score += 0.1; // % of revenue
    }

    // Negative externalities
    if (data.negative_externalities === 'low') score += 0.1;

    // Axiom X enhancement: Check for constitutional alignment in business model
    if (this.axiomContext.constitutional_memory.instructions) {
      if (this.axiomContext.constitutional_memory.instructions.includes('harm') ||
          this.axiomContext.constitutional_memory.instructions.includes('violence')) {
        // Company in harmful industry gets penalty
        if (this.isHarmfulIndustry(data.industry)) score -= 0.2;
      }
    }

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Evaluate Satya (Truthfulness) principle
   */
  async evaluateSatya(ticker, data) {
    let score = 0.5; // Start neutral

    // Financial transparency
    if (data.audit_opinions === 'clean') score += 0.15;
    if (data.disclosure_rating === 'high') score += 0.15;

    // Marketing honesty
    if (data.false_advertising_incidents === 0) score += 0.1;
    if (data.customer_complaints === 'low') score += 0.1;

    // Regulatory compliance
    if (data.regulatory_fines === 0) score += 0.1;
    if (data.legal_actions === 0) score += 0.1;

    // Stakeholder communication
    if (data.stakeholder_engagement === 'excellent') score += 0.1;

    // Axiom X enhancement: Check for truth-seeking in company culture
    if (this.axiomContext.evolution_markers['AXIOM_X_CONSTITUTIONAL_EVOLUTION_MARKER.md']) {
      const marker = this.axiomContext.evolution_markers['AXIOM_X_CONSTITUTIONAL_EVOLUTION_MARKER.md'];
      if (marker.includes('truth') || marker.includes('transparency')) {
        score += 0.1; // Bonus for truth-oriented companies
      }
    }

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Evaluate Asteya (Non-stealing) principle
   */
  async evaluateAsteya(ticker, data) {
    let score = 0.5; // Start neutral

    // Fair pricing
    if (data.price_gouging_incidents === 0) score += 0.15;
    if (data.consumer_protection_violations === 0) score += 0.15;

    // Intellectual property respect
    if (data.ip_infringement_cases === 0) score += 0.1;
    if (data.patent_litigation === 'defensive_only') score += 0.1;

    // Supplier relationships
    if (data.supplier_diversity === 'high') score += 0.1;
    if (data.fair_trade_certified === true) score += 0.1;

    // Tax practices
    if (data.tax_avoidance === 'minimal') score += 0.1;

    // Axiom X enhancement: Check for equitable business practices
    if (this.axiomContext.constitutional_memory.instructions) {
      if (this.axiomContext.constitutional_memory.instructions.includes('equity') ||
          this.axiomContext.constitutional_memory.instructions.includes('fairness')) {
        score += 0.1;
      }
    }

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Evaluate Brahmacharya (Self-discipline) principle
   */
  async evaluateBrahmacharya(ticker, data) {
    let score = 0.5; // Start neutral

    // Executive compensation reasonableness
    if (data.ceo_pay_ratio !== undefined) {
      const industry_avg = this.getIndustryAverage('ceo_pay_ratio', data.industry);
      if (data.ceo_pay_ratio < industry_avg) score += 0.15;
      if (data.ceo_pay_ratio < industry_avg * 0.8) score += 0.15;
    }

    // Growth sustainability
    if (data.growth_rate !== undefined && data.profit_margin !== undefined) {
      if (data.growth_rate > 0 && data.profit_margin > 0) score += 0.1;
    }

    // Resource conservation
    if (data.resource_efficiency === 'high') score += 0.1;
    if (data.waste_reduction === 'excellent') score += 0.1;

    // Ethical boundaries
    if (data.business_ethics_training === true) score += 0.1;

    // Axiom X enhancement: Check for disciplined constitutional adherence
    if (this.axiomContext.evolution_markers['AXIOM_X_COMPLETE_STATE_DOCUMENTATION.md']) {
      score += 0.1; // Bonus for companies that demonstrate constitutional awareness
    }

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Evaluate Aparigraha (Non-hoarding) principle
   */
  async evaluateAparigraha(ticker, data) {
    let score = 0.5; // Start neutral

    // Employee ownership
    if (data.employee_ownership_pct !== undefined) {
      if (data.employee_ownership_pct > 10) score += 0.15;
      if (data.employee_ownership_pct > 20) score += 0.15;
    }

    // Community reinvestment
    if (data.community_reinvestment_pct !== undefined) {
      if (data.community_reinvestment_pct > 2) score += 0.1;
    }

    // Knowledge sharing
    if (data.open_source_contributions === 'high') score += 0.1;
    if (data.industry_collaboration === 'active') score += 0.1;

    // Wealth distribution
    if (data.pay_equity_ratio !== undefined) {
      if (data.pay_equity_ratio > 0.8) score += 0.1; // More equal pay distribution
    }

    // Axiom X enhancement: Check for sharing/giving orientation
    if (this.axiomContext.constitutional_memory.instructions) {
      if (this.axiomContext.constitutional_memory.instructions.includes('sharing') ||
          this.axiomContext.constitutional_memory.instructions.includes('giving')) {
        score += 0.1;
      }
    }

    return Math.max(0, Math.min(1, score));
  }

  /**
   * Check if industry is inherently harmful
   */
  isHarmfulIndustry(industry) {
    const harmfulIndustries = [
      'weapons',
      'tobacco',
      'fossil_fuels',
      'gambling',
      'alcohol',
      'fast_food',
      'pharmaceuticals_monopoly'
    ];

    return harmfulIndustries.some(harmful =>
      industry?.toLowerCase().includes(harmful)
    );
  }

  /**
   * Get industry average for comparison
   */
  getIndustryAverage(metric, industry) {
    // Simplified industry averages - in production, this would be a comprehensive database
    const averages = {
      'carbon_intensity': {
        'technology': 50,
        'finance': 30,
        'healthcare': 40,
        'energy': 200,
        'manufacturing': 150
      },
      'ceo_pay_ratio': {
        'technology': 150,
        'finance': 200,
        'healthcare': 120,
        'energy': 180,
        'manufacturing': 100
      }
    };

    return averages[metric]?.[industry] || 100;
  }

  /**
   * Get constitutional assessment for multiple companies
   */
  async scoreCompaniesBatch(companies) {
    const results = [];

    for (const company of companies) {
      const score = await this.scoreCompany(company.ticker, company.data);
      results.push(score);

      // Small delay to avoid overwhelming
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
  }

  /**
   * Update company score based on new information
   */
  async updateCompanyScore(ticker, newData) {
    const existingScore = await this.getExistingScore(ticker);
    const updatedScore = await this.scoreCompany(ticker, { ...existingScore, ...newData });

    // Could implement temporal weighting here
    return updatedScore;
  }

  /**
   * Get existing score from cache/database
   */
  async getExistingScore(ticker) {
    // In production, this would query the database
    return this.companyDatabase.get(ticker) || {};
  }

  /**
   * Get ethical alignment level based on score
   */
  getEthicalAlignment(score) {
    if (score >= 0.9) return 'Transcendent';
    if (score >= 0.8) return 'Highly Aligned';
    if (score >= 0.7) return 'Well Aligned';
    if (score >= 0.6) return 'Moderately Aligned';
    if (score >= 0.4) return 'Poorly Aligned';
    return 'Misaligned';
  }
}

module.exports = ConstitutionalScorer;